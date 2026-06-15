import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

/**
 * Accordion-style FAQ item. Click toggles the answer. The chevron rotates,
 * and the question color shifts to race-red so the open item is unmistakable.
 */
const QuestionSection = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-asphalt-100 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={`w-full px-6 sm:px-8 py-5 text-left flex items-center justify-between gap-4 transition-colors duration-base ease-snap ${
          isOpen ? "bg-race-50" : "hover:bg-asphalt-50"
        }`}
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <span
            className={`flex-shrink-0 mt-0.5 h-7 w-7 rounded-md flex items-center justify-center font-display text-sm tracking-speedway transition-colors duration-base ease-snap ${
              isOpen
                ? "bg-race-600 text-chalk"
                : "bg-asphalt-100 text-asphalt-600"
            }`}
            aria-hidden="true"
          >
            Q
          </span>
          <h3
            className={`text-base sm:text-lg font-bold pr-2 transition-colors duration-base ease-snap ${
              isOpen ? "text-race-700" : "text-asphalt-900"
            }`}
          >
            {faq.question}
          </h3>
        </div>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 transition-transform duration-base ease-snap ${
            isOpen ? "text-race-600 rotate-180" : "text-asphalt-400"
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-slow ease-snap ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 sm:px-8 pb-6 pl-[3.75rem] sm:pl-[4.5rem]">
          <p className="text-asphalt-700 leading-relaxed">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
};

export default QuestionSection;
