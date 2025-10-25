import React from 'react';
import { Check, Phone } from 'lucide-react';
import Button from './Button.jsx';

const StripeProductCard = ({ product }) => {
  const handleBooking = () => {
    window.location.href = 'tel:(346) 932-1266';
  };

  return (
    <div className={`
      rounded-xl border p-6 shadow-sm h-full flex flex-col relative
      ${product.isPopular 
        ? 'border-red-600 shadow-md' 
        : 'border-gray-200 hover:border-red-300 transition-colors duration-300'
      }
    `}>
      {product.isPopular && (
        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
          POPULAR
        </div>
      )}
      
      <div className="mb-5">
        <h3 className="text-xl font-bold text-navy-900">{product.name}</h3>
        {product.description && (
          <p className="text-gray-600 mt-1">{product.description}</p>
        )}
      </div>
      
      <div className="mb-6">
        <span className="text-3xl font-bold text-navy-900">{product.price}</span>
      </div>
      
      <ul className="mb-6 space-y-3 flex-grow">
        {product.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check size={18} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      <Button 
        variant={product.isPopular ? 'primary' : 'outline'}
        fullWidth
        onClick={handleBooking}
        className="flex items-center justify-center space-x-2"
      >
        <Phone className="h-4 w-4" />
        <span>Call to Book</span>
      </Button>
    </div>
  );
};

export default StripeProductCard;
