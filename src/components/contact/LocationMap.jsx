import React from 'react';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import { CONTACT_INFO, BUSINESS_HOURS } from '../../utils/constants';

const LocationMap = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <div className="bg-red-100 p-3 rounded-full">
            <MapPin className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-navy-900 mb-1">Address</h3>
            <p className="text-gray-600">{CONTACT_INFO.address}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <div className="bg-red-100 p-3 rounded-full">
            <Phone className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-navy-900 mb-1">Phone</h3>
            <p className="text-gray-600">{CONTACT_INFO.phone}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <div className="bg-red-100 p-3 rounded-full">
            <Mail className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-navy-900 mb-1">Email</h3>
            <p className="text-gray-600">{CONTACT_INFO.email}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <div className="bg-red-100 p-3 rounded-full">
            <Clock className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-navy-900 mb-1">Hours</h3>
            <div className="text-gray-600 space-y-1">
              {BUSINESS_HOURS.map((schedule, index) => (
                <p key={index}>
                  <span className="font-medium">{schedule.day}:</span> {schedule.hours}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-200 rounded-lg h-64 overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3464.8234567890123!2d-94.9876543210987!3d29.7654321098765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c0123456789a%3A0x1234567890abcdef!2s6750%20N%20Tx-146%2C%20Baytown%2C%20TX%2077523!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Speedway 146 Location"
        />
      </div>
    </div>
  );
};

export default LocationMap;
