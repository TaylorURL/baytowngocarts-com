import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon.jsx";
import PageHero from "../components/common/PageHero.jsx";
import QuestionSection from "../components/sections/QuestionSection.jsx";
import { CONTACT_INFO } from "../lib/content/business.js";
import { FAQS } from "../lib/content/faqs.js";

const ALL_CATEGORIES_ID = "All";
const STICKY_THRESHOLD_PX = 80;

const FAQ_CATEGORIES = [
  { id: ALL_CATEGORIES_ID, icon: "search", label: "All Questions" },
  { id: "Racing", icon: "kart", label: "Racing" },
  { id: "Pricing", icon: "dollar-sign", label: "Pricing" },
  { id: "Events", icon: "trophy", label: "Events" },
  { id: "Policies", icon: "file-text", label: "Policies" },
];

const formatResultCount = (count) => `${count} Result${count !== 1 ? "s" : ""}`;

const ContentWrapper = ({ children, className = "" }) => (
  <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    <div className="max-w-4xl mx-auto">{children}</div>
  </div>
);

const getCategoryButtonClasses = (isActive, isSticky) => {
  if (isActive) return "bg-race-600 text-chalk shadow-race";
  if (isSticky)
    return "bg-asphalt-700 text-gray-300 hover:bg-asphalt-600";
  return "bg-asphalt-100 text-asphalt-700 hover:bg-asphalt-200";
};

const getCategoryBadgeClasses = (isActive, isSticky) => {
  if (isActive) return "bg-chalk text-race-600";
  if (isSticky) return "bg-asphalt-600 text-gray-400";
  return "bg-asphalt-200 text-asphalt-600";
};

const FAQHeroSection = ({ searchTerm, onSearchChange, filteredCount }) => (
  <PageHero
    badge="FAQ"
    title="The"
    titleAccent="long answers."
    description="Hours, height requirements, refund policy, group discounts, weather rules. Search or scroll."
    backgroundImage="/images/15.JPEG"
    dividerColorClass="bg-chalk"
  >
    <div className="mt-8 max-w-2xl mx-auto">
      <div className="relative">
        <Icon
          name="search"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-asphalt-400"
        />
        <input
          type="text"
          placeholder="Search by question or answer…"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-12 py-3.5 rounded-md text-base text-asphalt-900 bg-chalk border-2 border-transparent focus:border-race-500 focus:outline-none shadow-lift transition-[border-color] duration-base"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-asphalt-400 hover:text-asphalt-600 transition-colors"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        )}
      </div>
      {searchTerm && (
        <div className="mt-3 text-chalk/80 text-sm">
          Found {formatResultCount(filteredCount)} for "{searchTerm}"
        </div>
      )}
    </div>
  </PageHero>
);

const CategoryFilterBar = ({
  stickyRef,
  isSticky,
  selectedCategory,
  categoryCounts,
  onCategorySelect,
}) => (
  <section
    ref={stickyRef}
    className={`py-4 border-b-2 sticky top-[58px] lg:top-[112px] z-40 transition-colors duration-base ease-snap ${
      isSticky ? "bg-asphalt-800 border-race-600" : "bg-chalk border-asphalt-100"
    }`}
  >
    <ContentWrapper>
      <div className="flex flex-wrap justify-center gap-2">
        {FAQ_CATEGORIES.map(({ id, icon, label }) => {
          const count = categoryCounts[id] ?? 0;
          const isActive = selectedCategory === id;
          return (
            <button
              key={id}
              onClick={() => onCategorySelect(id)}
              aria-pressed={isActive}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-display tracking-speedway uppercase text-xs transition duration-base ease-snap active:scale-95 ${getCategoryButtonClasses(isActive, isSticky)}`}
            >
              <Icon name={icon} className="h-4 w-4" />
              <span>{label}</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${getCategoryBadgeClasses(isActive, isSticky)}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </ContentWrapper>
  </section>
);

const FAQResultsList = ({
  filteredFAQs,
  resultsHeading,
  selectedCategory,
  searchTerm,
  onClearSearch,
  onShowAll,
}) => {
  const isAllSelected = selectedCategory === ALL_CATEGORIES_ID;
  return (
    <section className="py-16 bg-asphalt-50">
      <ContentWrapper>
        <div
          className="bg-white rounded-lg shadow-track overflow-hidden border border-asphalt-200"
          data-aos="fade-up"
        >
          {filteredFAQs.length > 0 ? (
            <>
              <div className="px-8 py-5 bg-asphalt-900 border-b-2 border-race-600 text-chalk">
                <h2 className="text-lg font-display tracking-speedway uppercase">
                  {resultsHeading}
                </h2>
              </div>
              {filteredFAQs.map((faq, index) => (
                <QuestionSection
                  key={`${selectedCategory}-${index}`}
                  faq={faq}
                />
              ))}
            </>
          ) : (
            <div className="p-12 text-center">
              <Icon
                name="help-circle"
                className="h-16 w-16 text-asphalt-300 mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-asphalt-900 mb-2">
                Nothing matches.
              </h3>
              <p className="text-asphalt-600 mb-6">
                {searchTerm
                  ? `No questions match "${searchTerm}"${isAllSelected ? "" : ` in ${selectedCategory}`}.`
                  : "No questions in this category."}
              </p>
              <div className="flex gap-3 justify-center">
                {searchTerm && (
                  <button
                    onClick={onClearSearch}
                    className="bg-race-600 hover:bg-race-500 text-chalk px-6 py-2.5 rounded-md font-display tracking-speedway uppercase text-sm transition duration-base ease-snap active:scale-95"
                  >
                    Clear Search
                  </button>
                )}
                {!isAllSelected && (
                  <button
                    onClick={onShowAll}
                    className="bg-asphalt-100 hover:bg-asphalt-200 text-asphalt-800 px-6 py-2.5 rounded-md font-display tracking-speedway uppercase text-sm transition duration-base ease-snap active:scale-95"
                  >
                    Show All
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </ContentWrapper>
    </section>
  );
};

const ContactCTASection = () => (
  <section className="py-20 bg-chalk">
    <ContentWrapper>
      <div className="bg-asphalt-900 rounded-lg shadow-lift overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-10">
            <Icon name="help-circle" className="h-12 w-12 text-race-500 mb-5" />
            <h2 className="text-3xl font-bold text-chalk mb-3">
              Didn't find it?
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Most things not on this page are venue-specific — call the track
              and we'll answer in two minutes.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-race-600 p-2.5 rounded-md flex-shrink-0">
                  <Icon name="phone" className="h-4 w-4 text-chalk" />
                </div>
                <div>
                  <h4 className="text-chalk font-bold text-sm">By Phone</h4>
                  <p className="text-gray-400 text-sm">
                    Fastest path. Open during business hours.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-race-600 p-2.5 rounded-md flex-shrink-0">
                  <Icon name="send" className="h-4 w-4 text-chalk" />
                </div>
                <div>
                  <h4 className="text-chalk font-bold text-sm">By Form</h4>
                  <p className="text-gray-400 text-sm">
                    Same-day reply, not always within the hour.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-10 flex flex-col justify-center bg-asphalt-950">
            <h3 className="text-2xl font-bold text-chalk mb-4">Reach the track</h3>
            <p className="text-gray-300 mb-6 text-sm">
              Phone is faster than email for time-sensitive bookings.
            </p>
            <div className="space-y-3">
              <a
                href={CONTACT_INFO.phoneTel}
                className="flex items-center justify-center gap-3 bg-race-600 hover:bg-race-500 text-chalk px-6 py-3.5 rounded-md font-display tracking-speedway uppercase text-sm transition duration-base ease-snap active:scale-95 shadow-race tabular-nums"
              >
                <Icon name="phone" className="h-5 w-5" />
                {CONTACT_INFO.phone}
              </a>
              <Link
                to="/contact"
                className="w-full flex items-center justify-center gap-3 bg-asphalt-800 hover:bg-asphalt-700 text-chalk px-6 py-3.5 rounded-md font-display tracking-speedway uppercase text-sm transition duration-base ease-snap active:scale-95"
              >
                <Icon name="send" className="h-5 w-5" />
                Contact Form
              </Link>
            </div>
            <div className="mt-6 pt-6 border-t border-chalk/10">
              <p className="text-gray-400 text-xs text-center">
                Open Thursday – Sunday. Check our Google page for holiday hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ContentWrapper>
  </section>
);

const ReadyToRaceCTA = () => (
  <section className="py-20 text-chalk bg-asphalt-900 relative overflow-hidden">
    <div className="absolute inset-0 asphalt-grain opacity-50" aria-hidden="true" />
    <div className="absolute top-0 left-0 right-0 h-1.5 race-stripe" aria-hidden="true" />
    <ContentWrapper>
      <div className="relative z-10 text-center" data-aos="fade-up">
        <h2 className="font-display text-4xl lg:text-5xl tracking-tight leading-[0.95] mb-6">
          That's the answers.
          <span className="block text-race-500">Now run a heat.</span>
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
          Single race is $13.99. Family deal is $59.99 for four. Wristband is
          2.5 hours unlimited.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/pricing">
            <Button size="lg" variant="light">
              See Pricing
            </Button>
          </Link>
          <Link to="/events">
            <Button size="lg" variant="outlineLight">
              Book a Party
            </Button>
          </Link>
        </div>
      </div>
    </ContentWrapper>
  </section>
);

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES_ID);
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef(null);
  const anchorRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        const rect = stickyRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= STICKY_THRESHOLD_PX);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToStickyPosition = () => {
    anchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    scrollToStickyPosition();
  };

  const categoryCounts = useMemo(() => {
    const counts = { [ALL_CATEGORIES_ID]: FAQS.length };
    for (const faq of FAQS) {
      counts[faq.category] = (counts[faq.category] || 0) + 1;
    }
    return counts;
  }, []);

  const filteredFAQs = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return FAQS.filter((faq) => {
      const matchesCategory =
        selectedCategory === ALL_CATEGORIES_ID ||
        faq.category === selectedCategory;
      const matchesSearch =
        !searchTerm ||
        faq.question.toLowerCase().includes(lowerSearch) ||
        faq.answer.toLowerCase().includes(lowerSearch);
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const isAllSelected = selectedCategory === ALL_CATEGORIES_ID;
  const resultsHeading = searchTerm
    ? formatResultCount(filteredFAQs.length)
    : isAllSelected
      ? `All Questions (${filteredFAQs.length})`
      : `${selectedCategory} (${filteredFAQs.length})`;

  return (
    <div className="w-full -mt-20">
      <FAQHeroSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filteredCount={filteredFAQs.length}
      />
      <div ref={anchorRef} className="scroll-mt-20" />
      <CategoryFilterBar
        stickyRef={stickyRef}
        isSticky={isSticky}
        selectedCategory={selectedCategory}
        categoryCounts={categoryCounts}
        onCategorySelect={handleCategorySelect}
      />
      <FAQResultsList
        filteredFAQs={filteredFAQs}
        resultsHeading={resultsHeading}
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        onClearSearch={() => setSearchTerm("")}
        onShowAll={() => setSelectedCategory(ALL_CATEGORIES_ID)}
      />
      <ContactCTASection />
      <ReadyToRaceCTA />
    </div>
  );
};

export default FAQPage;
