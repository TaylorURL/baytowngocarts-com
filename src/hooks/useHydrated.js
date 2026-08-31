import { useSyncExternalStore } from "react";

/*
 * The build writes each indexed route's markup into its own document, and the
 * first client render has to reproduce that markup or React discards the tree
 * it was attaching to. A query string is not part of the path the build
 * rendered, so anything read from it -- or from the window, or from storage --
 * belongs behind this: false while the tree attaches, true from the render
 * straight after.
 *
 * The switch is a store read rather than an effect so it lands with hydration
 * rather than a frame later, which is the difference between the page arriving
 * on the requested tab and arriving on the default one first.
 */

const subscribe = () => () => {};

const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

export default useHydrated;
