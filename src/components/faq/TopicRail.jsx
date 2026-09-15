import { useEffect, useRef } from "react";

/*
 * The topic rail over the FAQ document.
 *
 * The links are anchors and nothing else: they move the reader down one
 * document rather than swapping which questions exist, so the page works with
 * no script running, the browser's own find-in-page reaches every answer, and
 * a link to one topic is a URL somebody can send.
 *
 * The active mark is the site's own: a colour change on the label and a 3px
 * race rule that scales out from the centre, the same as the header's primary
 * navigation. Reaching for that rather than the filter bar's solid red pill is
 * the point of the rail -- one navigation idiom on the site, used twice.
 */

const TopicRail = ({ sections, activeId, emptyIds = [], railRef }) => {
  const listRef = useRef(null);

  /* Below lg the rail scrolls sideways, so the topic being read has to be
     brought into its own view as well as marked. `nearest` keeps the rail
     still while the active item is already visible, which is most of the
     time; without it every section boundary yanks the rail sideways. */
  useEffect(() => {
    if (!activeId || !listRef.current) return;
    const link = listRef.current.querySelector(`[data-topic="${activeId}"]`);
    link?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activeId]);

  /* The rail is opaque, because the header it sticks under is opaque. A
     translucent strip between a solid bar and the page is a third material on
     a site that has two, and a blur buys nothing behind a document that is
     already chalk. */
  return (
    <div
      ref={railRef}
      className="sticky top-[var(--header-height)] z-docked border-b border-asphalt-200"
      data-theme="light"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="FAQ topics">
          <ul
            ref={listRef}
            className="-mx-1 flex items-stretch gap-6 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {sections.map(({ id, label }) => {
              const isActive = activeId === id;
              const isEmpty = emptyIds.includes(id);
              /* A search can leave a topic with nothing under it, and there is
                 then no section on the page for its anchor to reach. It stays
                 on the rail so the set of topics does not shuffle under the
                 reader's eye, but it stops being a link rather than becoming
                 a link that goes nowhere. */
              const As = isEmpty ? "span" : "a";
              return (
                <li key={id} className="shrink-0">
                  <As
                    href={isEmpty ? undefined : `#${id}`}
                    data-topic={id}
                    aria-current={isActive ? "true" : undefined}
                    className="group relative flex h-11 items-center whitespace-nowrap focus-visible:outline-none"
                  >
                    <span
                      className={`font-display text-sm uppercase leading-none tracking-speedway transition-colors duration-fast ease-snap group-focus-visible:underline group-focus-visible:decoration-2 group-focus-visible:underline-offset-4 ${
                        isEmpty
                          ? "text-asphalt-400"
                          : isActive
                            ? "text-race-600"
                            : "text-asphalt-500 group-hover:text-asphalt-900"
                      }`}
                    >
                      {label}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-0 left-1/2 h-[3px] w-full origin-center -translate-x-1/2 rounded-pill bg-race-600 transition-transform duration-slow ease-snap ${
                        isActive
                          ? "scale-x-100"
                          : isEmpty
                            ? "scale-x-0"
                            : "scale-x-0 group-hover:scale-x-50"
                      }`}
                    />
                  </As>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default TopicRail;
