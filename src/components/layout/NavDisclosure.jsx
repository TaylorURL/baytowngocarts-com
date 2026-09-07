import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../ui/Icon.jsx";

/*
 * A top-level destination that opens the sections beneath it.
 *
 * Destinations run plainly down the left. The right column is a different
 * kind of content rather than more links - the one thing the bar wants
 * clicked from this destination, with its own figure and its own call - which
 * is what keeps the panel from reading as a longer menu.
 *
 * The word itself stays a link, so the destination is still one click away;
 * the chevron beside it is the trigger, so a pointer heading for the page is
 * never intercepted by a panel. It opens on the trigger rather than on hover,
 * which is the only behaviour a keyboard and a touch screen can both reach.
 * The panel closes on Escape, on a click outside, when focus leaves the
 * group, and when a link in it is taken.
 */
const NavDisclosure = ({ item, isActive, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const holderRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    const onPointer = (e) => {
      if (holderRef.current && !holderRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    onNavigate?.();
  };

  return (
    <div
      ref={holderRef}
      className="relative flex items-center"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false);
      }}
    >
      <Link
        to={item.href}
        onClick={close}
        aria-current={isActive ? "page" : undefined}
        className="group relative flex h-11 items-center pl-5 pr-1"
      >
        <span
          className={`block text-base font-display tracking-speedway uppercase leading-none transition-colors duration-base ease-snap ${
            isActive ? "text-chalk" : "text-gray-400 group-hover:text-chalk"
          }`}
        >
          {item.label}
        </span>
        <span
          aria-hidden="true"
          className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[3px] w-3/5 rounded-pill bg-race-500 origin-center transition-transform duration-slow ease-snap ${
            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
          }`}
        />
      </Link>

      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={panelId}
        aria-label={`${item.label} sections`}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 items-center pr-4 pl-0.5 text-gray-500 hover:text-chalk transition-colors duration-base ease-snap"
      >
        <Icon
          name="chevron-down"
          className={`h-3.5 w-3.5 transition-transform duration-base ease-snap ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        id={panelId}
        data-nav-panel
        data-state={isOpen ? "open" : "closed"}
        className={`absolute left-1/2 top-full z-drawer w-[40rem] -translate-x-1/2 pt-3 transition-[opacity,transform] duration-base ease-snap ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-1"
        }`}
      >
        <div className="overflow-hidden rounded-lg border border-white/10 bg-asphalt-900 shadow-lift">
          <div className="h-[3px] race-stripe" aria-hidden="true" />
          <div className="flex">
            <div className="min-w-0 flex-1 p-3">
              <p className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-gray-400">
                {item.panel.summary}
              </p>
              <ul>
                {item.panel.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      onClick={close}
                      tabIndex={isOpen ? 0 : -1}
                      className="group/row block rounded-md px-3 py-2.5 transition-colors duration-base ease-snap hover:bg-asphalt-800"
                    >
                      <span className="block font-display tracking-speedway uppercase text-sm text-chalk">
                        {link.label}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-gray-400">
                        {link.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Two groups, one step apart: what it is, then what it costs
                and where to go for it. */}
            <div className="w-60 flex-none border-l border-white/10 bg-asphalt-950 p-5">
              <div className="space-y-2">
                <p className="font-display text-[10px] tracking-speedway uppercase text-race-500">
                  {item.panel.feature.eyebrow}
                </p>
                <p className="font-display text-lg leading-tight tracking-tight text-chalk">
                  {item.panel.feature.title}
                </p>
              </div>
              <div className="mt-6 space-y-2">
                <p className="font-display text-4xl leading-none tracking-wide tabular-nums text-chalk">
                  {item.panel.feature.figure}
                </p>
                <p className="text-xs text-gray-400">
                  {item.panel.feature.note}
                </p>
                <Link
                  to={item.panel.feature.href}
                  onClick={close}
                  tabIndex={isOpen ? 0 : -1}
                  className="inline-flex min-h-11 items-center gap-2 font-display text-xs tracking-speedway uppercase text-race-400 transition-colors duration-base ease-snap hover:text-chalk"
                >
                  {item.panel.feature.cta}
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavDisclosure;
