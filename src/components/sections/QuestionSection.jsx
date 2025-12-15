import React, {useState} from 'react';
import {CheckCircle, ChevronDown, ChevronUp} from 'lucide-react';

const QuestionSection = ({faq}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 last:border-b-0 transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-8 py-6 text-left flex items-center justify-between transition-all duration-300 ${
                    isOpen ? 'bg-red-50' : 'hover:bg-gray-50'
                }`}
            >
                <div className="flex items-start gap-4 flex-1">
                    <div
                        className={`flex-shrink-0 mt-1 transition-colors duration-300 ${isOpen ? 'text-red-600' : 'text-gray-400'}`}>
                        <CheckCircle className="h-6 w-6"/>
                    </div>
                    <h3 className={`text-lg font-bold pr-4 transition-colors duration-300 ${
                        isOpen ? 'text-red-600' : 'text-navy-900'
                    }`}>
                        {faq.question}
                    </h3>
                </div>
                <div className="flex-shrink-0">
                    {isOpen ? (
                        <ChevronUp className="h-6 w-6 text-red-600 transition-transform duration-300"/>
                    ) : (
                        <ChevronDown className="h-6 w-6 text-gray-400 transition-transform duration-300"/>
                    )}
                </div>
            </button>

            {isOpen && (
                <div className="px-8 pb-6 pl-[4.5rem] animate-slide-up">
                    <p className="text-gray-700 leading-relaxed text-lg">
                        {faq.answer}
                    </p>
                </div>
            )}
        </div>
    );
};

export default QuestionSection;
