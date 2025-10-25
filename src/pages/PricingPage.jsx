import React from 'react';
import { Phone } from 'lucide-react';
import StripeProductCard from '../components/pricing/StripeProductCard';
import { BOUNCE_PRICING } from '../utils/constants';
import { STRIPE_PRODUCTS } from '../stripe-config';

const PricingPage = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-red-900 via-red-800 to-navy-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Pricing & Packages
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Affordable racing and entertainment for everyone
            </p>
          </div>
        </div>
      </section>

      {/* Go-Kart Racing */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">
              Go-Kart Racing
            </h2>
            <p className="text-xl text-gray-600">
              High-speed thrills for all ages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STRIPE_PRODUCTS.map((product, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <StripeProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bounce House Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">
              Bounce House Fun
            </h2>
            <p className="text-xl text-gray-600">
              Safe jumping fun for kids of all ages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BOUNCE_PRICING.map((plan, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <div className={`
                  rounded-xl border p-6 shadow-sm h-full flex flex-col relative
                  ${plan.isPopular 
                    ? 'border-red-600 shadow-md' 
                    : 'border-gray-200 hover:border-red-300 transition-colors duration-300'
                  }
                `}>
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                      POPULAR
                    </div>
                  )}
                  
                  <div className="mb-5">
                    <h3 className="text-xl font-bold text-navy-900">{plan.title}</h3>
                    {plan.description && (
                      <p className="text-gray-600 mt-1">{plan.description}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-navy-900">{plan.price}</span>
                  </div>
                  
                  <ul className="mb-6 space-y-3 flex-grow">
                    {plan.items.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2"></div>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors button-hover"
                    onClick={() => window.location.href = '/contact'}
                  >
                    Reserve Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-20 bg-gradient-to-br from-navy-900 via-red-900 to-navy-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold mb-8">
              How to Book & Important Information
            </h2>
            
            <div className="mb-12 p-6 bg-red-600 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Ready to Race?</h3>
              <p className="text-red-100 mb-4">
                Call us to purchase your racing packages and reserve your spot!
              </p>
              <a
                href="tel:(346) 932-1266"
                className="inline-flex items-center bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call (346) 932-1266
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="text-xl font-bold mb-4 text-red-400">Age Guidelines</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Kid karts ideal for ages 6-10</li>
                  <li>• Adult karts for ages 11+</li>
                  <li>• All drivers must follow safety guidelines</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 text-red-400">Policies</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 3-Race Combo must be used same day</li>
                  <li>• Safety equipment provided</li>
                  <li>• Waiver required for all participants</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-red-600 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Special Offers!</h3>
              <p className="text-red-100">
                Contact us for group discounts, party packages, and special event pricing.
              </p>
            </div>
            
            <div className="mt-8 p-6 bg-navy-800 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-red-400">Required Waivers</h3>
              <p className="text-gray-300 mb-4">All participants must complete a waiver before racing. Download and complete before your visit for faster check-in:</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/images/Speedway146_Waiver_Address_Footer_Fixed.pdf" 
                  download
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
                >
                  Download Go-Kart Waiver
                </a>
                <a 
                  href="/images/Bounce House Participant Waiver and Release PDF.pdf" 
                  download
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
                >
                  Download Bounce House Waiver
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;