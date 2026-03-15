import React, { useEffect, useMemo, useRef, useState } from "react";
import QuestionSection from "../components/sections/QuestionSection.jsx";
import { FAQS } from "../lib/constants.js";
import Button from "../components/common/Button";
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

/**
 * Renders the FAQ page with searchable, filterable frequently asked questions.
 */
const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef(null);
  const anchorRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        const rect = stickyRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 80);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToStickyPosition = () => {
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    scrollToStickyPosition();
  };

  const categories = useMemo(
    () => [
      { id: "All", icon: Search, label: "All Questions" },
      { id: "Racing", icon: Zap, label: "Racing" },
      { id: "Pricing", icon: DollarSign, label: "Pricing" },
      { id: "Events", icon: Users, label: "Events" },
      { id: "Policies", icon: Calendar, label: "Policies" },
    ],
    [],
  );

  const getCategoryCount = (categoryId) => {
    if (categoryId === "All") return FAQS.length;
    return FAQS.filter((faq) => faq.category === categoryId).length;
  };

  const filteredFAQs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesCategory =
        selectedCategory === "All" || faq.category === selectedCategory;
      const matchesSearch =
        !searchTerm ||
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="w-full -mt-20">
      <section className="relative bg-navy-900 overflow-hidden pt-32 pb-20 min-h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url(/images/15.JPEG)" }}
          />
        </div>

        <div
          className="absolute inset-0 z-5 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(45deg, var(--color-black) 25%, transparent 25%), linear-gradient(-45deg, var(--color-black) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--color-black) 75%), linear-gradient(-45deg, transparent 75%, var(--color-black) 75%)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          }}
        />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <div className="inline-block mb-6 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold tracking-wider">
              HELP CENTER
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Frequently Asked <span className="text-red-500">Questions</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Find quick answers to common questions about racing, pricing,
              events, and our policies
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions and answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-14 py-4 rounded-xl text-lg text-gray-800 border-2 border-transparent focus:border-gray-500 focus:outline-none shadow-lg"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className="mt-4 text-white text-sm">
                  Found {filteredFAQs.length} result
                  {filteredFAQs.length !== 1 ? "s" : ""} for "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-white"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0% 100%)" }}
        />
      </section>

      <div ref={anchorRef} className="scroll-mt-20"></div>

      <section
        ref={stickyRef}
        className={`py-4 border-b-2 sticky top-[58px] lg:top-[112px] z-40 transition-all duration-300 ${
          isSticky ? "bg-gray-800 border-red-600" : "bg-white border-gray-100"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => {
                const count = getCategoryCount(category.id);
                const isActive = selectedCategory === category.id;
                const IconComponent = category.icon;

                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-red-600 text-white shadow-lg scale-105"
                        : isSticky
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-sm">{category.label}</span>
                    <span
                      className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                        isActive
                          ? "bg-white text-red-600"
                          : isSticky
                            ? "bg-gray-600 text-gray-400"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
              data-aos="fade-up"
            >
              {filteredFAQs.length > 0 ? (
                <>
                  <div className="px-8 py-6 bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                    <h2 className="text-2xl font-bold">
                      {searchTerm
                        ? `${filteredFAQs.length} Result${filteredFAQs.length !== 1 ? "s" : ""}`
                        : selectedCategory !== "All"
                          ? `${selectedCategory} (${filteredFAQs.length})`
                          : `All Questions (${filteredFAQs.length})`}
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
                  <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm
                      ? `No questions match "${searchTerm}" in the ${selectedCategory === "All" ? "selected" : selectedCategory} category`
                      : "No questions in this category"}
                  </p>
                  <div className="flex gap-3 justify-center">
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
                      >
                        Clear Search
                      </button>
                    )}
                    {selectedCategory !== "All" && (
                      <button
                        onClick={() => setSelectedCategory("All")}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-bold transition-all"
                      >
                        Show All
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-12">
                  <HelpCircle className="h-16 w-16 text-red-500 mb-6" />
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Still Have Questions?
                  </h2>
                  <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                    If you couldn't find the answer you were looking for, our
                    friendly team is here to help. Reach out and we'll get back
                    to you right away!
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-red-600 p-3 rounded-lg flex-shrink-0">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">
                          Call Us Directly
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Get immediate answers to your questions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-red-600 p-3 rounded-lg flex-shrink-0">
                        <MessageSquare className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">
                          Send a Message
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Fill out our contact form anytime
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="p-12 flex flex-col justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #334155 0%, #1e293b 100%)",
                  }}
                >
                  <h3 className="text-3xl font-bold text-white mb-6">
                    Get in Touch
                  </h3>
                  <p className="text-gray-300 mb-8 text-lg">
                    Choose the best way to reach us
                  </p>
                  <div className="space-y-4">
                    <a
                      href="tel:(346) 932-1266"
                      className="flex items-center justify-center gap-3 bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold transition-all hover:scale-105"
                    >
                      <Phone className="h-5 w-5" />
                      (346) 932-1266
                    </a>
                    <Link to="/contact">
                      <button className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105">
                        <MessageSquare className="h-5 w-5" />
                        Contact Form
                      </button>
                    </Link>
                  </div>
                  <div className="mt-8 pt-8 border-t border-white border-opacity-20">
                    <p className="text-gray-300 text-sm text-center">
                      Available Thursday-Sunday during business hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-20 text-white"
        style={{
          background:
            "linear-gradient(135deg, #334155 0%, #1e293b 50%, #0f172a 100%)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Race?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Now that you have your answers, come experience the thrill of
              Speedway 146!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-red-600 hover:bg-gray-100 border-0 text-xl px-10 py-5"
                >
                  View Pricing
                </Button>
              </Link>
              <Link to="/events">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-800 text-xl px-10 py-5"
                >
                  Book Event
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
