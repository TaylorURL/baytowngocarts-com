import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Button from '../common/Button.jsx';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    eventType: '',
    guestCount: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="space-y-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Get In Touch</h3>
        <p className="text-red-700 text-sm">
          Use the form below to contact us about events, parties, general questions, or any other inquiries. 
          For immediate assistance, please call us directly at (346) 932-1266.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Event Date *
          </label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            required
            value={formData.eventDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
          Inquiry Type *
        </label>
        <select
          id="eventType"
          name="eventType"
          required
          value={formData.eventType}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
        >
          <option value="">Select inquiry type</option>
          <option value="go-kart-racing">Go-Kart Racing</option>
          <option value="bounce-house">Bounce House (On-site)</option>
          <option value="bounce-rental">Bounce House Rental (Off-site)</option>
          <option value="birthday-party">Birthday Party</option>
          <option value="corporate-event">Corporate Event</option>
          <option value="party-room">Party Room Rental</option>
          <option value="general">General Question</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Additional Information
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          placeholder="Tell us about your event, number of guests, specific requirements, etc."
        ></textarea>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          * Required fields. For immediate assistance or to make reservations, 
          please call us at (346) 932-1266.
        </p>
      </div>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-red-900 mb-3">Required Waivers</h4>
        <p className="text-red-700 text-sm mb-3">
          All participants must complete a waiver before activities. Download and complete before your visit:
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a 
            href="/images/Speedway146_Waiver_Address_Footer_Fixed.pdf" 
            download
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-center text-sm"
          >
            Download Go-Kart Waiver
          </a>
          <a 
            href="/images/Bounce%20House%20Participant%20Waiver%20and%20Release%20PDF.pdf"
            download
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-center text-sm"
          >
            Download Bounce House Waiver
          </a>
        </div>
      </div>
      
      <Button
        type="submit"
        variant="primary"
        fullWidth
        className="flex items-center justify-center space-x-2"
      >
        <Send className="h-5 w-5" />
        <span>Submit Request</span>
      </Button>
    </form>
    </div>
  );
};

export default ContactForm;
