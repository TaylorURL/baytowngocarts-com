import React from 'react';
import ContactForm from '../components/contact/ContactForm';
import LocationMap from '../components/contact/LocationMap';

const ContactPage: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-navy-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Have questions or want to book a party? We're here to help you plan your visit to Speedway 146.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Contact Form</h2>
              
              <ContactForm />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Find Us</h2>
              <p className="text-gray-700 mb-8">
                We're conveniently located in Baytown, TX. Visit us during our business hours or contact us to plan your next fun adventure!
              </p>
              
              <LocationMap />
              
              <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Digital Waiver</h3>
                <p className="text-red-700 text-sm">
                  For a faster check-in process, you can complete our waiver form before your visit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;