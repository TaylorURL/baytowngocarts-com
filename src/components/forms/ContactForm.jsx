import React, { useState } from "react";
import { CheckCircle, Send } from "lucide-react";
import Button from "../common/Button.jsx";

const INPUT_CLASS =
  "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent";

const CONTACT_EMAIL = "speedsway146@gmail.com";

/**
 * Contact/inquiry form with fields for name, email, phone, event date,
 * inquiry type, and a message. Includes waiver download links.
 */
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    eventType: "",
    guestCount: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Speedway 146 Inquiry — ${formData.eventType || "General"} — ${formData.name}`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${formData.name}`,
        `Email: ${formData.email}`,
        `Phone: ${formData.phone}`,
        `Preferred Date: ${formData.eventDate || "Not specified"}`,
        `Inquiry Type: ${formData.eventType || "Not specified"}`,
        formData.message ? `\nMessage:\n${formData.message}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center space-y-4">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
        <h3 className="text-lg font-semibold text-green-900">Request Sent!</h3>
        <p className="text-green-700 text-sm">
          Your email client should have opened with your inquiry pre-filled. If
          it didn't open automatically, please email us directly at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline font-medium">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Get In Touch
        </h3>
        <p className="text-red-700 text-sm">
          Use the form below to contact us about events, parties, general
          questions, or any other inquiries. For immediate assistance, please
          call us directly at (346) 932-1266.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label
              htmlFor="eventDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Preferred Event Date *
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              required
              value={formData.eventDate}
              onChange={handleChange}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="eventType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Inquiry Type *
          </label>
          <select
            id="eventType"
            name="eventType"
            required
            value={formData.eventType}
            onChange={handleChange}
            className={INPUT_CLASS}
          >
            <option value="">Select inquiry type</option>
            <option value="go-kart-racing">Go-Kart Racing</option>
            <option value="bounce-house">Bounce House (On-site)</option>
            <option value="bounce-rental">
              Bounce House Rental (Off-site)
            </option>
            <option value="birthday-party">Birthday Party</option>
            <option value="corporate-event">Corporate Event</option>
            <option value="party-room">Party Room Rental</option>
            <option value="general">General Question</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Additional Information
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            className={INPUT_CLASS}
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
          <h4 className="text-lg font-semibold text-red-900 mb-3">
            Required Waivers
          </h4>
          <p className="text-red-700 text-sm mb-3">
            All participants must complete a waiver before activities. Download
            and complete before your visit:
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
