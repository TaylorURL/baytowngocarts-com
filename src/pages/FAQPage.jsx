import React from 'react';
import FAQItem from '../components/common/FAQItem';
import { FAQS } from '../utils/constants';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-900 via-red-800 to-navy-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-white mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-300">
              Find answers to common questions about our go-karts, bounce houses, and policies.
            </p>
          </div>
        </div>
      </div>
      
      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {FAQS.map((faq, index) => (
              <FAQItem key={index} faq={faq} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold text-navy-900 mb-4">Still have questions?</h3>
            <p className="text-gray-700 mb-6">
              If you couldn't find the answer you were looking for, please don't hesitate to contact us directly.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="tel:(346) 932-1266" 
                className="inline-flex items-center justify-center rounded-md bg-navy-800 px-6 py-3 text-white font-medium hover:bg-navy-700 transition-colors duration-300"
              >
                Call Us
              </a>
              
              <Link to="/contact">
                <Button variant="primary" size="lg">
                  Contact Form
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default FAQPage;