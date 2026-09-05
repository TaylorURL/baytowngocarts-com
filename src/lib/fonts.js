import { whenSettled } from "./idle.js";

/*
 * Brings up the Barlow weights the first screen does not set.
 *
 * A font file is fetched at the highest priority the browser has, ahead of
 * almost everything else it is holding, because text that has laid out in a
 * fallback is text that will move when the real face lands. That is the right
 * ordering for the weight the first screen is written in and the wrong one for
 * the three the rail, the footer and the cards below the fold are: 68 KB at
 * the front of the queue, on the link the photograph the page is measured on
 * is still coming down.
 *
 * So those weights are declared in a sheet of their own and asked for here,
 * once the document has landed and been shown. What the reader sees in the
 * meantime is the metric-matched stand-in every face on this site already
 * falls back to, set at the same size on the same line, so the swap when it
 * comes changes the letterforms and moves nothing.
 */
export function startFontWeights() {
  whenSettled(() => {
    import("../styles/barlow-weights.css");
  });
}
