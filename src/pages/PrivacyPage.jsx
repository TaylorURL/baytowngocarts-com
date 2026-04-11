import React from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
const PrivacyPage = () => (
  <div className="w-full -mt-20">
    <section
      className="relative overflow-hidden pt-32 pb-20 min-h-[50vh] flex items-center"
      style={{
        background:
          "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)",
      }}
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <Shield className="h-16 w-16 mx-auto mb-6 text-gray-300" />
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
            Privacy <span className="text-red-500">Policy</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Last updated: March 15, 2026
          </p>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-white"
        style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0% 100%)" }}
      />
    </section>
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto prose prose-gray text-gray-700 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              1. Introduction
            </h2>
            <p>
              This Privacy Policy explains how Speedway 146 ("we," "us," or
              "our") and TaylorURL ("website operator," "developer") collect,
              use, disclose, and protect your personal information when you
              visit our website at baytowngocarts.com, use our services, or
              interact with us in any way.
            </p>
            <p>
              By accessing or using our website and services, you agree to the
              collection and use of information in accordance with this policy.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              2. Information We Collect
            </h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Personal Information:</strong> Name, email address,
                phone number, mailing address, and payment information when you
                make a purchase or contact us.
              </li>
              <li>
                <strong>Account Information:</strong> Username, password, and
                profile details when you create an account.
              </li>
              <li>
                <strong>Transaction Data:</strong> Records of purchases,
                bookings, event reservations, and payment history.
              </li>
              <li>
                <strong>Usage Data:</strong> Browser type, IP address, device
                information, pages visited, time spent on pages, referring URLs,
                and other analytics data.
              </li>
              <li>
                <strong>Communications:</strong> Messages, inquiries, and
                feedback you send us through contact forms, email, or other
                channels.
              </li>
              <li>
                <strong>Cookies and Tracking:</strong> We use cookies, web
                beacons, and similar technologies to collect information about
                your browsing behavior.
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              3. How We Use Your Information
            </h2>
            <p>
              Speedway 146 and TaylorURL may use your information for any lawful
              purpose, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Processing transactions and managing your account</li>
              <li>Providing, maintaining, and improving our services</li>
              <li>
                Communicating with you about promotions, events, updates, and
                offers
              </li>
              <li>Personalizing your experience on our website</li>
              <li>Analytics, research, and business intelligence purposes</li>
              <li>Marketing, advertising, and promotional activities</li>
              <li>Developing new products, services, or features</li>
              <li>Enforcing our terms and complying with legal obligations</li>
              <li>
                Any other purpose at the discretion of Speedway 146 or TaylorURL
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              4. Data Sharing and Disclosure
            </h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Speedway 146:</strong> As the business operator,
                Speedway 146 has full access to and rights over all data
                collected through this website.
              </li>
              <li>
                <strong>TaylorURL:</strong> As the website developer and
                operator, TaylorURL has full access to and rights over all data
                collected through this website, including the right to use such
                data for any lawful business purpose.
              </li>
              <li>
                <strong>Service Providers:</strong> Third-party vendors who help
                us operate our website, process payments, send communications,
                or provide other services.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law,
                regulation, or legal process.
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a
                merger, acquisition, or sale of assets.
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              5. Data Retention
            </h2>
            <p>
              We retain your personal information for as long as necessary to
              fulfill the purposes outlined in this policy, or as required by
              law. Speedway 146 and TaylorURL reserve the right to retain data
              indefinitely for business, analytical, or archival purposes.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              6. Cookies and Tracking Technologies
            </h2>
            <p>
              We use cookies and similar technologies to enhance your
              experience, analyze usage patterns, and deliver targeted content.
              You may adjust your browser settings to refuse cookies, but some
              features of our website may not function properly without them.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              7. Third-Party Links
            </h2>
            <p>
              Our website may contain links to third-party websites. We are not
              responsible for the privacy practices or content of those sites.
              We encourage you to review their privacy policies before providing
              any personal information.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              8. Children's Privacy
            </h2>
            <p>
              Our services are intended for a general audience. We do not
              knowingly collect personal information from children under 13
              without parental consent. If you believe we have collected
              information from a child under 13, please contact us so we can
              take appropriate action.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              9. Security
            </h2>
            <p>
              We implement reasonable security measures to protect your personal
              information. However, no method of transmission over the internet
              or electronic storage is completely secure, and we cannot
              guarantee absolute security.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              10. Your Rights
            </h2>
            <p>
              Depending on your jurisdiction, you may have the right to access,
              correct, delete, or restrict the processing of your personal
              information. To exercise these rights, please contact us using the
              information below. Note that Speedway 146 and TaylorURL reserve
              the right to retain and use data as permitted by applicable law.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              11. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy at any time without prior
              notice. Changes are effective immediately upon posting to this
              page. Your continued use of our website after changes constitutes
              acceptance of the updated policy.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              12. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy, please contact
              us:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: speedway146@gmail.com</li>
              <li>Phone: (346) 932-1266</li>
              <li>Address: 6750 N TX-146, Baytown, TX 77523</li>
            </ul>
          </div>
          <div className="pt-8 border-t border-gray-200 text-center">
            <Link
              to="/terms"
              className="text-red-600 hover:text-red-700 font-bold transition-colors"
            >
              View Terms of Service →
            </Link>
          </div>
        </div>
      </div>
    </section>
  </div>
);
export default PrivacyPage;
