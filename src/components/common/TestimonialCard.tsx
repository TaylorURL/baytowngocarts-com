import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '../../types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover-lift relative">
      <Quote className="h-8 w-8 text-red-600 mb-4" />
      
      <div className="flex items-center mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
        ))}
      </div>
      
      <p className="text-gray-700 mb-6 italic">
        "{testimonial.content}"
      </p>
      
      <div className="border-t pt-4">
        <h4 className="font-bold text-navy-900">{testimonial.name}</h4>
      </div>
    </div>
  );
};

export default TestimonialCard;