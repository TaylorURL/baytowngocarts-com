import { withBuildRefresh } from "./chunk-recovery.js";
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
 * once the document has landed and been shown. Until it arrives every one of
 * those lines sets in weight 400, the only Barlow face the document declares:
 * a family is matched before a weight is, so the stand-in is never reached and
 * the typeface never changes, and the browser darkens the bolder cuts itself.
 * What the real faces bring is the advance the designer drew - a percent or so
 * on a word, several on a row of digits - inside line boxes whose height the
 * family keeps across every weight.
 */
const loadWeights = withBuildRefresh(
  () => import("../styles/barlow-weights.css"),
);

export function startFontWeights() {
  whenSettled(() => {
    loadWeights().catch(() => {
      // A sheet the served build no longer has is a document this tab has
      // outlived, which is what the refresh the loader carries answers. Where
      // the tab has already spent its one reload, the page goes on setting
      // these lines in the weight it has rather than ending on an error.
    });
  });
}
