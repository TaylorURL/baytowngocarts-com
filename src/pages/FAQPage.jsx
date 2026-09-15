import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon.jsx";
import PageHero from "../components/layout/PageHero.jsx";
import TopicRail from "../components/faq/TopicRail.jsx";
import RouteMeta from "../components/shell/RouteMeta.jsx";
import useHydrated from "../hooks/useHydrated.js";
import useSectionSpy from "../hooks/useSectionSpy.js";
import { CONTACT_INFO } from "../lib/content/business.js";
import { FAQ_SECTIONS, FAQS } from "../lib/content/faqs.js";
import { SHARE_IMAGE, SITE_URL } from "../lib/seo/schema.js";
import { Link, useSearchParams } from "react-router-dom";

export const metadata = {
  title: "Go-Kart FAQ | Age, Height & Rules at Speedway 146",
  description:
    "Height and age limits, what to wear, how long a heat runs, whether you can bring your own food, and the rest of what people ask first.",
  canonical: "/faq",
  heroImage: "/images/15.webp",
  robots: "index, follow",
  crumbs: [{ name: "FAQ", path: "/faq" }],
  openGraph: {
    "og:title": "Go-Kart FAQ | Age, Height & Rules at Speedway 146",
    "og:description":
      "Height and age limits, what to wear, how long a heat runs, whether you can bring your own food, and the rest of what people ask first.",
    "og:url": SITE_URL + "/faq",
    "og:image": SHARE_IMAGE,
    "og:type": "website",
  },
};

/* The document is one column at the reading measure, centred, on every band of
   the page that carries prose. */
const Measure = ({ children, className = "" }) => (
  <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    <div className="mx-auto max-w-measure">{children}</div>
  </div>
);

const FAQHero = ({ searchTerm, onSearchChange }) => (
  <PageHero
    badge="FAQ"
    heading={
      <h1 className="mb-6 text-5xl font-bold leading-[0.95] tracking-tight text-chalk md:text-6xl lg:text-7xl">
        Asked and <span className="text-race-500">answered.</span>
      </h1>
    }
    crumbs={metadata.crumbs}
    description="Hours, heights, prices, weather, waivers. Every answer is on this page — pick a topic or search."
    backgroundImage="/images/15.webp"
  >
    <div className="mx-auto mt-8 max-w-xl">
      <div className="relative">
        <Icon
          name="search"
          aria-hidden="true"
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-asphalt-400"
        />
        <label htmlFor="faq-search" className="sr-only">
          Search the FAQ
        </label>
        <input
          id="faq-search"
          type="search"
          autoComplete="off"
          placeholder="Search every answer…"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border-2 border-transparent bg-chalk py-3.5 pl-12 pr-12 text-base text-asphalt-900 shadow-lift transition-[border-color] duration-base focus:border-race-500 focus:outline-none"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear Search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-asphalt-400 transition-colors hover:text-asphalt-600"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  </PageHero>
);

const Entry = ({ faq }) => (
  <article>
    {/* The question is a heading in the text face, not the display face. The
        answer is set at the same size and a lighter weight, so the pair reads
        as one passage rather than as a label above a paragraph. */}
    <h3 className="heading-prose mt-10 text-[1.0625rem] font-semibold text-asphalt-900">
      {faq.question}
    </h3>
    <p className="mt-5 text-[1.0625rem] leading-[1.65] text-asphalt-700">
      {faq.answer}
    </p>
  </article>
);

const Topic = ({ section, entries, isFirst }) => (
  <section
    id={section.id}
    aria-labelledby={`${section.id}-heading`}
    className={`scroll-mt-14 ${
      isFirst ? "" : "mt-16 border-t border-asphalt-200 pt-12"
    }`}
  >
    <h2
      id={`${section.id}-heading`}
      className="text-3xl uppercase tracking-tight text-asphalt-900 md:text-4xl"
    >
      {section.heading}
    </h2>
    <p className="mt-3 text-asphalt-500">{section.blurb}</p>
    {entries.map((faq) => (
      <Entry key={faq.question} faq={faq} />
    ))}
  </section>
);

const NoMatch = ({ searchTerm, onClearSearch }) => (
  <div role="status">
    <h2 className="text-2xl uppercase tracking-tight text-asphalt-900">
      Nothing matches “{searchTerm}”
    </h2>
    <p className="mt-3 text-[1.0625rem] leading-[1.65] text-asphalt-700">
      Try a single word rather than a phrase, or call the track on{" "}
      <a
        href={CONTACT_INFO.phoneTel}
        className="font-semibold text-race-700 underline underline-offset-4 hover:text-race-600"
      >
        {CONTACT_INFO.phone}
      </a>
      .
    </p>
    <Button
      variant="outline"
      size="sm"
      className="mt-6"
      onClick={onClearSearch}
    >
      Clear Search
    </Button>
  </div>
);

const Document = ({
  sections,
  entriesOf,
  searchTerm,
  matchCount,
  onClearSearch,
}) => (
  <div data-theme="light" className="pb-24 pt-14">
    <Measure>
      {/* The count and the empty state are the same sentence at different
          numbers, so only one of them is ever on the page. */}
      {searchTerm && matchCount > 0 && (
        <p className="mb-2 text-sm text-asphalt-500" role="status">
          {matchCount === 1 ? "1 answer" : `${matchCount} answers`} matching “
          {searchTerm}”.
        </p>
      )}
      {sections.map((section, index) => (
        <Topic
          key={section.id}
          section={section}
          entries={entriesOf(section.id)}
          isFirst={index === 0}
        />
      ))}
      {searchTerm && matchCount === 0 && (
        <NoMatch searchTerm={searchTerm} onClearSearch={onClearSearch} />
      )}
    </Measure>
  </div>
);

/* One closer, because the page had two saying the same thing from opposite
   ends: a panel offering the phone and a band offering the phone again under
   a heading about racing. What a reader who got to the bottom of the answers
   still needs is the number. */
const StillAsking = () => (
  <section className="relative overflow-hidden bg-asphalt-950 py-20 text-chalk">
    <div
      className="asphalt-grain pointer-events-none absolute inset-0 opacity-50"
      aria-hidden="true"
    />
    <div
      className="race-stripe absolute left-0 right-0 top-0 h-1.5"
      aria-hidden="true"
    />
    <Measure className="relative z-10">
      <div data-aos="fade">
        <h2 className="text-4xl uppercase leading-[0.95] tracking-tight lg:text-5xl">
          Still asking?
          <span className="block text-race-500">Call the track.</span>
        </h2>
        <p className="mt-6 text-[1.0625rem] leading-[1.65] text-gray-300">
          Anything not on this page is usually specific to your date, your group
          or the weather that afternoon, and the phone answers all three faster
          than a form. We are open Thursday to Sunday.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            href={CONTACT_INFO.phoneTel}
            size="lg"
            className="tabular-nums"
          >
            <Icon name="phone" className="h-5 w-5" />
            {CONTACT_INFO.phone}
          </Button>
          <Button to="/contact" size="lg" variant="outlineLight">
            <Icon name="send" className="h-5 w-5" />
            Contact Form
          </Button>
        </div>
        <p className="mt-8 border-t border-chalk/10 pt-6 text-sm text-gray-400">
          Ready to race?{" "}
          <Link
            to="/pricing"
            className="font-semibold text-chalk underline underline-offset-4 hover:text-race-300"
          >
            See pricing
          </Link>{" "}
          or{" "}
          <Link
            to="/events"
            className="font-semibold text-chalk underline underline-offset-4 hover:text-race-300"
          >
            book a party
          </Link>
          .
        </p>
      </div>
    </Measure>
  </section>
);

const FAQPage = () => {
  /* Links elsewhere on the site can land here with the search pre-filled via
     /faq?search=…. The document the host serves for that URL is the one the
     build rendered, which carries every question, so the filter is only
     applied once the tree has attached to it. */
  const [searchParams] = useSearchParams();
  const hydrated = useHydrated();
  const urlSearchTerm = searchParams.get("search") ?? "";
  const [enteredSearch, setEnteredSearch] = useState(urlSearchTerm);
  const searchTerm = hydrated ? enteredSearch : "";

  useEffect(() => {
    setEnteredSearch(urlSearchTerm);
  }, [urlSearchTerm]);

  const matches = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return FAQS;
    return FAQS.filter(
      (faq) =>
        faq.question.toLowerCase().includes(needle) ||
        faq.answer.toLowerCase().includes(needle),
    );
  }, [searchTerm]);

  const entriesOf = (id) => matches.filter((faq) => faq.section === id);

  /* A section with nothing left in it comes out of the document and greys out
     in the rail, rather than staying as a heading over an empty column. */
  const presentSections = FAQ_SECTIONS.filter((s) => entriesOf(s.id).length);
  const emptyIds = FAQ_SECTIONS.filter((s) => !entriesOf(s.id).length).map(
    (s) => s.id,
  );

  const railRef = useRef(null);
  const activeId = useSectionSpy(
    presentSections.map((s) => s.id),
    railRef,
  );

  return (
    <div className="-mt-20 w-full">
      <RouteMeta metadata={metadata} />
      <FAQHero searchTerm={searchTerm} onSearchChange={setEnteredSearch} />
      <TopicRail
        railRef={railRef}
        sections={FAQ_SECTIONS}
        activeId={activeId}
        emptyIds={emptyIds}
      />
      <Document
        sections={presentSections}
        entriesOf={entriesOf}
        searchTerm={searchTerm}
        matchCount={matches.length}
        onClearSearch={() => setEnteredSearch("")}
      />
      <StillAsking />
    </div>
  );
};

export default FAQPage;
