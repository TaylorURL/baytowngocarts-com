import weightsHref from "../styles/barlow-weights.css?url";
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
 *
 * THE SHEET IS ATTACHED HERE, MARKED, RATHER THAN IMPORTED. A dynamic import
 * of a stylesheet is a link the bundler creates where nothing on the page can
 * see it, and the page watches for stylesheets that fail: the one in the
 * document is the whole of the design past the first screen, so a failure
 * there is answered with a reload of the document and, where that is not
 * available, with a notice telling the reader the page did not finish loading.
 * This sheet is not that, and it was getting that answer - a settled page
 * reloaded out from under a reader over three font weights, or a notice over a
 * page they could read perfectly - and it was spending the one reload the
 * design's own sheet needs. The mark is what tells the two apart, so the sheet
 * is attached by name, with the mark on it. The recovery in index.html asks
 * once more for a marked sheet and then leaves the page alone; the failure is
 * reported either way.
 *
 * Nothing waits on it and nothing reads from it, so there is no promise to
 * hand back: what the sheet does is arrive, and the type it sets is correct
 * before it does.
 */
export function startFontWeights() {
  whenSettled(() => {
    try {
      const head = document.head || document.documentElement;
      if (!head) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.setAttribute("data-optional", "");
      link.href = weightsHref;
      head.appendChild(link);
    } catch {
      // A document that will not take a link is not one this can fix, and the
      // page sets these lines in the weight it has either way.
    }
  });
}
