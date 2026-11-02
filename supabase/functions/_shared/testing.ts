/*
 * A stand-in for the Supabase client in the cases: every chain of calls is
 * recorded, and `answer` decides what the awaited chain resolves to. Enough of
 * the client for the shared code, without a database.
 */

export type Query = { table: string; ops: [string, ...unknown[]][] };

export function fakeDb(answer: (query: Query) => unknown) {
  const queries: Query[] = [];
  const rpcs: { name: string; args: unknown }[] = [];
  const chain = (query: Query): unknown =>
    new Proxy(
      {},
      {
        get(_, op) {
          if (op === "then") {
            return (
              resolve: (value: unknown) => unknown,
              reject: (reason: unknown) => unknown,
            ) => Promise.resolve(answer(query)).then(resolve, reject);
          }
          return (...args: unknown[]) => {
            query.ops.push([String(op), ...args]);
            return chain(query);
          };
        },
      },
    );
  return {
    queries,
    rpcs,
    rpcAnswer: (_name: string, _args: unknown): unknown => ({
      data: [],
      error: null,
    }),
    from(table: string) {
      const query: Query = { table, ops: [] };
      queries.push(query);
      return chain(query);
    },
    rpc(name: string, args: unknown) {
      rpcs.push({ name, args });
      return Promise.resolve(this.rpcAnswer(name, args));
    },
  };
}

export const has = (query: Query, op: string) =>
  query.ops.some(([name]) => name === op);

export const argOf = (query: Query, op: string) =>
  query.ops.find(([name]) => name === op)?.[1];

/** Swaps fetch for the length of one case. */
export async function withFetch(
  handler: (url: string, init?: RequestInit) => Response,
  run: (calls: { url: string; init?: RequestInit }[]) => Promise<void>,
) {
  const original = globalThis.fetch;
  const calls: { url: string; init?: RequestInit }[] = [];
  globalThis.fetch = ((input: string | URL | Request, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();
    calls.push({ url, init });
    return Promise.resolve(handler(url, init));
  }) as typeof fetch;
  try {
    await run(calls);
  } finally {
    globalThis.fetch = original;
  }
}
