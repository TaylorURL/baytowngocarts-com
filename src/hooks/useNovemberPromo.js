import { novemberPromoOver } from "../lib/content/november.js";
import useHydrated from "./useHydrated.js";

/*
 * Whether the November promotion is still on.
 *
 * The build writes each indexed route into a document of its own, so whether
 * the promotion was running is frozen at the moment the build ran, and the
 * only clock that knows what day it is now belongs to the browser. Reading
 * that clock during hydration would answer a question the markup React is
 * attaching to has already answered the other way, and React would throw the
 * tree away. So the first client render agrees with the document and the one
 * straight after it tells the truth: a visitor arriving in December sees the
 * band for a frame at most, and it is gone without a reload.
 *
 * The structured data carries its own `validThrough`, so a crawler reading a
 * stale document is still told the month the extra night belongs to.
 */
const useNovemberPromo = () => !useHydrated() || !novemberPromoOver();

export default useNovemberPromo;
