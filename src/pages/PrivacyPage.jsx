import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield } from "lucide-react";
const PrivacyPage = () => (
  <div className="w-full -mt-20">
    <section className="relative overflow-hidden pt-32 pb-20 min-h-[50vh] flex items-center bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <div className="inline-flex items-center justify-center h-16 w-16 mx-auto mb-6 rounded-2xl bg-red-600/15 ring-1 ring-red-500/30">
            <Shield className="h-8 w-8 text-red-500" />
          </div>
          <div className="inline-block mb-6 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-display tracking-widest">
            LEGAL
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
            Privacy <span className="text-red-500">Policy</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Last updated: March 15, 2026
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white [clip-path:polygon(0_100%,100%_0,100%_100%,0%_100%)]" />
    </section>
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-gray-700 leading-relaxed space-y-12">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
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
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              2. Information We Collect
            </h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-red-500">
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
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              3. How We Use Your Information
            </h2>
            <p>
              Speedway 146 and TaylorURL may use your information for any lawful
              purpose, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 marker:text-red-500">
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
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              4. Data Sharing and Disclosure
            </h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-red-500">
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
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
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
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
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
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
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
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
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
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
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
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
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
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
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
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              12. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy, please contact
              us:
            </p>
            <ul className="list-disc pl-6 space-y-2 marker:text-red-500">
              <li>Email: speedway146@gmail.com</li>
              <li>Phone: (346) 932-1266</li>
              <li>Address: 6750 N TX-146, Baytown, TX 77523</li>
            </ul>
          </div>
          <div className="pt-10 mt-4 border-t border-gray-200 text-center">
            <Link
              to="/terms"
              className="group inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-bold transition-colors"
            >
              View Terms of Service
              <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  </div>
);
export default PrivacyPage;
