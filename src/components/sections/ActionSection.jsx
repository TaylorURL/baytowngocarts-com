import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Calendar, Zap } from 'lucide-react';
import Button from '../common/Button.jsx';

const ActionSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto" data-aos="fade-up">
          <Zap className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready for an Unforgettable Experience?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Bring your family and friends to Speedway 146 for a day filled with racing, bouncing, and creating memories that last a lifetime
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="bg-white text-red-600 hover:bg-gray-100 border-0 text-xl px-10 py-5 flex items-center gap-3">
                <span>View Pricing</span>
                <ArrowRight className="h-6 w-6" />
              </Button>
            </Link>
            
            <Link to="/events">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 text-xl px-10 py-5 flex items-center gap-3">
                <Calendar className="h-6 w-6" />
                <span>Plan Your Event</span>
              </Button>
            </Link>
          </div>

          <div className="mt-12 pt-12 border-t border-white border-opacity-20">
            <p className="text-red-100 mb-4">Need help planning? Give us a call!</p>
            <a
              href="tel:(346) 932-1266"
              className="inline-flex items-center gap-3 bg-navy-900 hover:bg-navy-800 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105"
            >
              <Phone className="h-5 w-5" />
              (346) 932-1266
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActionSection;