import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Phone } from 'lucide-react';
import Button from '../components/common/Button';

const SuccessPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-red-900 to-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-red-900 to-navy-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-navy-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for choosing Speedway 146! Your booking has been confirmed.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-900 mb-2">What's Next?</h3>
              <ul className="text-green-700 text-sm space-y-1 text-left">
                <li>• Visit us during business hours</li>
                <li>• Bring a valid ID and completed waiver</li>
                <li>• Payment will be processed at the facility</li>
                <li>• Get ready to race!</li>
              </ul>
            </div>

            <div className="flex flex-col space-y-3">
              <a
                href="tel:(346) 932-1266"
                className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call for More Bookings
              </a>
              
              <Link to="/">
                <Button variant="outline" fullWidth>
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;