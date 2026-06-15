import { useEffect, useMemo, useRef, useState } from "react";
import QuestionSection from "../components/sections/QuestionSection.jsx";
import { CONTACT_INFO } from "../lib/content/business.js";
import { FAQS } from "../lib/content/faqs.js";
import Button from "../components/common/Button";
import Pill from "../components/common/Pill.jsx";
import { Link } from "react-router-dom";
import {
  Calendar,
  DollarSign,
  HelpCircle,
  MessageSquare,
  Phone,
  Search,
  Users,
  X,
  Zap,
} from "lucide-react";
const ALL_CATEGORIES_ID = "All";
const STICKY_THRESHOLD_PX = 80;
const FAQ_CATEGORIES = [
  { id: ALL_CATEGORIES_ID, icon: Search, label: "All Questions" },
  { id: "Racing", icon: Zap, label: "Racing" },
  { id: "Pricing", icon: DollarSign, label: "Pricing" },
  { id: "Events", icon: Users, label: "Events" },
  { id: "Policies", icon: Calendar, label: "Policies" },
];
const CONTACT_METHODS = [
  {
    icon: Phone,
    title: "Call Us Directly",
    description: "Get immediate answers to your questions",
  },
  {
    icon: MessageSquare,
    title: "Send a Message",
    description: "Fill out our contact form anytime",
  },
];
/** Pluralizes "result" based on count */
const formatResultCount = (count) => `${count} Result${count !== 1 ? "s" : ""}`;
/** Shared content-width wrapper used by every page section */
const ContentWrapper = ({ children, className = "" }) => (
  <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    <div className="max-w-4xl mx-auto">{children}</div>
  </div>
);
/** Returns Tailwind classes for a category filter button based on active/sticky state */
const getCategoryButtonClasses = (isActive, isSticky) => {
  if (isActive) return "bg-red-600 text-white shadow-lg scale-105";
  if (isSticky)
    return "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105";
  return "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105";
};
/** Returns Tailwind classes for the count badge inside a category button */
const getCategoryBadgeClasses = (isActive, isSticky) => {
  if (isActive) return "bg-white text-red-600";
  if (isSticky) return "bg-gray-600 text-gray-400";
  return "bg-gray-200 text-gray-600";
};
const FAQHeroSection = ({ searchTerm, onSearchChange, filteredCount }) => (
  <section className="relative bg-navy-900 overflow-hidden pt-32 pb-20 min-h-[70vh] flex items-center">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-cover bg-center opacity-30 bg-[url('/images/15.JPEG')]" />
    </div>
    {/* Crosshatch overlay pattern */}
    <div className="absolute inset-0 z-[5] opacity-10 checker-overlay" />
    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
        <div className="inline-block mb-6 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-display tracking-widest">
          HELP CENTER
        </div>
        <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
          Frequently Asked <span className="text-red-500">Questions</span>
        </h1>
        <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
          Find quick answers to common questions about racing, pricing, events,
          and our policies
        </p>
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions and answers..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-14 pr-14 py-4 rounded-xl text-lg text-gray-800 border-2 border-transparent focus:border-red-500 shadow-lg transition-colors duration-200 ease-out"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="mt-4 text-white text-sm">
              Found {formatResultCount(filteredCount)} for "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-16 z-[6] bg-white [clip-path:polygon(0_100%,100%_0,100%_100%,0%_100%)]" />
  </section>
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
    className={`py-4 border-b-2 sticky top-[58px] lg:top-[112px] z-40 transition-colors duration-300 ease-out ${
      isSticky ? "bg-gray-800 border-red-600" : "bg-white border-gray-100"
    }`}
  >
    <ContentWrapper>
      <div className="flex flex-wrap justify-center gap-2">
        {FAQ_CATEGORIES.map(({ id, icon: Icon, label }) => {
          const count = categoryCounts[id] ?? 0;
          const isActive = selectedCategory === id;
          return (
            <button
              key={id}
              onClick={() => onCategorySelect(id)}
              aria-pressed={isActive}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition duration-200 ease-out active:scale-95 ${getCategoryButtonClasses(isActive, isSticky)}`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{label}</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${getCategoryBadgeClasses(isActive, isSticky)}`}
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
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <ContentWrapper>
        <div
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          data-aos="fade-up"
        >
          {filteredFAQs.length > 0 ? (
            <>
              <div className="px-8 py-6 bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                <h2 className="text-2xl font-bold">{resultsHeading}</h2>
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
              <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? `No questions match "${searchTerm}" in the ${isAllSelected ? "selected" : selectedCategory} category`
                  : "No questions in this category"}
              </p>
              <div className="flex gap-3 justify-center">
                {searchTerm && (
                  <button
                    onClick={onClearSearch}
                    className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-bold transition-colors duration-200 ease-out active:scale-95"
                  >
                    Clear Search
                  </button>
                )}
                {!isAllSelected && (
                  <button
                    onClick={onShowAll}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-bold transition-colors duration-200 ease-out active:scale-95"
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
  <section className="py-24 bg-white">
    <ContentWrapper>
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-12">
            <HelpCircle className="h-16 w-16 text-red-500 mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              If you couldn't find the answer you were looking for, our friendly
              team is here to help. Reach out and we'll get back to you right
              away!
            </p>
            <div className="space-y-4">
              {CONTACT_METHODS.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="bg-red-600 p-3 rounded-lg flex-shrink-0">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">{title}</h4>
                    <p className="text-gray-400 text-sm">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-12 flex flex-col justify-center bg-gradient-to-br from-slate-700 to-slate-800">
            <h3 className="text-3xl font-bold text-white mb-6">Get in Touch</h3>
            <p className="text-gray-300 mb-8 text-lg">
              Choose the best way to reach us
            </p>
            <div className="space-y-4">
              <a
                href={PHONE_TEL_LINK}
                className="flex items-center justify-center gap-3 bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold transition duration-200 ease-out hover:scale-105 active:scale-95"
              >
                <Phone className="h-5 w-5" />
                {CONTACT_INFO.phone}
              </a>
              <Link
                to="/contact"
                className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-bold transition duration-200 ease-out hover:scale-105 active:scale-95"
              >
                <MessageSquare className="h-5 w-5" />
                Contact Form
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-gray-300 text-sm text-center">
                Available 7 days a week during business hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </ContentWrapper>
  </section>
);
const ReadyToRaceCTA = () => (
  <section className="py-20 text-white bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
    <ContentWrapper>
      <div className="text-center" data-aos="fade-up">
        <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Race?</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Now that you have your answers, come experience the thrill of Speedway
          146!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/pricing">
            <Button size="lg" variant="light" className="text-xl px-10 py-5">
              View Pricing
            </Button>
          </Link>
          <Link to="/events">
            <Button
              size="lg"
              variant="outlineLight"
              className="text-xl px-10 py-5"
            >
              Book Event
            </Button>
          </Link>
        </div>
      </div>
    </ContentWrapper>
  </section>
);
/**
 * Renders the FAQ page with searchable, filterable frequently asked questions.
 */
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
