import { useState } from "react";
import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";
import { CONTACT_INFO } from "../../lib/content/business.js";

const INPUT_CLASS =
  "w-full px-4 py-3 bg-white border border-asphalt-200 rounded-md text-asphalt-900 placeholder:text-asphalt-400 focus:outline-none focus:ring-2 focus:ring-race-500 focus:border-race-500 transition-[border-color,box-shadow] duration-base";

const LABEL_CLASS =
  "block text-xs font-display tracking-speedway uppercase text-asphalt-700 mb-2";

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    window.location.href = `mailto:${CONTACT_INFO.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-8 text-center space-y-4">
        <Icon name="check-circle" className="h-12 w-12 text-green-600 mx-auto" />
        <h3 className="text-lg font-bold text-green-900">Request Sent</h3>
        <p className="text-green-700 text-sm">
          Your email client should have opened with the inquiry pre-filled. If
          it didn't, write directly to{" "}
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="underline font-medium"
          >
            {CONTACT_INFO.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-asphalt-200 bg-asphalt-50 p-6">
        <h3 className="text-xs font-display tracking-speedway uppercase text-race-600 mb-2">
          Booking a party room?
        </h3>
        <p className="text-asphalt-700 text-sm leading-relaxed">
          The fastest path is a phone call —{" "}
          <a
            href={CONTACT_INFO.phoneTel}
            className="text-race-600 hover:text-race-700 font-bold tabular-nums"
          >
            {CONTACT_INFO.phone}
          </a>
          . Or fill this in and we'll reach back the same day.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={LABEL_CLASS}>
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
            <label htmlFor="email" className={LABEL_CLASS}>
              Email *
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
            <label htmlFor="phone" className={LABEL_CLASS}>
              Phone *
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
            <label htmlFor="eventDate" className={LABEL_CLASS}>
              Date in mind
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div>
          <label htmlFor="eventType" className={LABEL_CLASS}>
            What's it for? *
          </label>
          <select
            id="eventType"
            name="eventType"
            required
            value={formData.eventType}
            onChange={handleChange}
            className={INPUT_CLASS}
          >
            <option value="">Pick one</option>
            <option value="birthday-party">Birthday party (party room)</option>
            <option value="corporate-event">Corporate / team outing</option>
            <option value="thursday-special">Thursday unlimited special</option>
            <option value="bounce-rental">Off-site bounce house rental</option>
            <option value="general">General question</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className={LABEL_CLASS}>
            Anything we should know
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className={INPUT_CLASS}
            placeholder="Guest count, ages, time of day, allergies, special requests…"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          className="flex items-center justify-center"
        >
          <Icon name="send" className="h-5 w-5" />
          <span>Send Request</span>
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
