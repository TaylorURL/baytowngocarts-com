import { CONTACT_INFO } from "../../lib/content/business.js";
import { NOVEMBER_PROMO } from "../../lib/content/november.js";
import useNovemberPromo from "../../hooks/useNovemberPromo.js";
import Icon from "../ui/Icon.jsx";

/*
 * The rail above the bar. It carries what a visitor needs from the venue
 * rather than from the site - the number, where the track is, and which days
 * it opens - so the bar underneath holds destinations, the cart and the
 * account and nothing else. It only renders where there is room for it; below
 * lg the same three facts are in the drawer and the hero.
 */

const UtilityStrip = () => {
  const novemberOn = useNovemberPromo();
  return (
    <div className="hidden lg:block bg-asphalt-950 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[var(--header-utility)] items-center justify-end gap-7 text-gray-400">
          <a
            href={CONTACT_INFO.phoneTel}
            className="flex items-center gap-2 hover:text-chalk transition-colors duration-base ease-snap"
          >
            <Icon name="phone" className="h-3.5 w-3.5 text-race-500" />
            <span className="text-xs font-semibold tracking-wide tabular-nums">
              {CONTACT_INFO.phone}
            </span>
          </a>
          <a
            href={CONTACT_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:flex items-center gap-2 hover:text-chalk transition-colors duration-base ease-snap"
          >
            <Icon name="map-pin" className="h-3.5 w-3.5 text-race-500" />
            <span className="text-xs font-semibold tracking-wide">
              {CONTACT_INFO.addressLine1}, Baytown
            </span>
          </a>
          <span className="flex items-center gap-2">
            <Icon name="clock" className="h-3.5 w-3.5 text-race-500" />
            <span className="text-xs font-semibold tracking-wide">
              {novemberOn ? NOVEMBER_PROMO.hoursNote : "Open Friday to Sunday"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default UtilityStrip;
