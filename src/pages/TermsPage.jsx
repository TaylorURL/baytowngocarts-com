import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
const TermsPage = () => (
  <div className="w-full -mt-20">
    <section className="relative overflow-hidden pt-32 pb-20 min-h-[50vh] flex items-center bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <div className="inline-flex items-center justify-center h-16 w-16 mx-auto mb-6 rounded-2xl bg-red-600/15 ring-1 ring-red-500/30">
            <FileText className="h-8 w-8 text-red-500" />
          </div>
          <div className="inline-block mb-6 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-display tracking-widest">
            LEGAL
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
            Terms of <span className="text-red-500">Service</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Last updated: March 15, 2026
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 z-[6] bg-white [clip-path:polygon(0_100%,100%_0,100%_100%,0%_100%)]" />
    </section>
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-gray-700 leading-relaxed space-y-12">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using the Speedway 146 website
              (baytowngocarts.com), purchasing tickets, booking events, or using
              any of our services, you agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use our
              website or services.
            </p>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              2. Services
            </h2>
            <p>
              Speedway 146 provides go-kart racing, bounce house access, party
              room rentals, and related entertainment services at our Baytown,
              TX location. Services are subject to availability and may change
              without notice.
            </p>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              3. User Accounts
            </h2>
            <p>
              You may be required to create an account to access certain
              features. You are responsible for maintaining the confidentiality
              of your account credentials and for all activities that occur
              under your account. You agree to provide accurate and complete
              information and to update it as necessary.
            </p>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              4. Purchases and Payments
            </h2>
            <ul className="list-disc pl-6 space-y-2 marker:text-red-500">
              <li>
                All prices are listed in US dollars and are subject to change
                without notice.
              </li>
              <li>
                Payment is required at the time of purchase. We accept major
                credit cards and other payment methods as displayed at checkout.
              </li>
              <li>
                All sales are final unless otherwise stated. Refunds and
                exchanges are handled at the sole discretion of Speedway 146.
              </li>
              <li>
                Speedway 146 reserves the right to cancel or modify any
                purchase, booking, or reservation at any time.
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              5. Assumption of Risk and Liability Waiver
            </h2>
            <p>
              Go-kart racing and other physical activities involve inherent
              risks, including but not limited to bodily injury. By
              participating, you acknowledge and accept these risks. You agree
              to follow all posted rules, safety guidelines, and staff
              instructions.
            </p>
            <p>
              To the fullest extent permitted by law, Speedway 146, TaylorURL,
              and their owners, operators, employees, and agents shall not be
              liable for any injury, loss, damage, or expense arising from your
              use of our facilities, services, or website.
            </p>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              6. Data Usage and Consent
            </h2>
            <p>
              By using this website and our services, you consent to the
              collection, storage, and use of your personal data by both
              Speedway 146 and TaylorURL (the website developer and operator).
            </p>
            <ul className="list-disc pl-6 space-y-2 marker:text-red-500">
              <li>
                Speedway 146 and TaylorURL each have the unrestricted right to
                use, analyze, share, and retain any data collected through this
                website for any lawful purpose, including but not limited to
                marketing, analytics, product development, and business
                operations.
              </li>
              <li>
                This data includes personal information, transaction records,
                usage data, communications, and any other information provided
                or collected during your use of the website.
              </li>
              <li>
                You waive any claims against Speedway 146 or TaylorURL related
                to the use of data collected through this website, to the extent
                permitted by law.
              </li>
            </ul>
            <p>
              For more details, please review our{" "}
              <Link
                to="/privacy"
                className="text-red-600 hover:text-red-700 font-bold underline decoration-red-300 decoration-2 underline-offset-2 transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              7. Intellectual Property
            </h2>
            <p>
              All content on this website — including text, images, graphics,
              logos, and software — is the property of Speedway 146 and/or
              TaylorURL and is protected by applicable intellectual property
              laws. You may not reproduce, distribute, or create derivative
              works from our content without written permission.
            </p>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              8. User Conduct
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-red-500">
              <li>
                Use the website for any unlawful purpose or in violation of
                these terms
              </li>
              <li>
                Attempt to gain unauthorized access to any part of the website
                or its systems
              </li>
              <li>
                Interfere with or disrupt the website's operation or servers
              </li>
              <li>
                Use automated tools to scrape, crawl, or extract data from the
                website without permission
              </li>
              <li>
                Impersonate any person or entity or misrepresent your
                affiliation
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              9. Age Requirements
            </h2>
            <p>
              Certain activities at Speedway 146 may have age and height
              requirements. Parents or guardians are responsible for ensuring
              minors meet all requirements and follow all safety rules. A parent
              or guardian must accept these terms on behalf of any minor using
              our services.
            </p>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              10. Event Bookings
            </h2>
            <p>
              Event and party reservations are subject to availability and our
              event policies. Speedway 146 reserves the right to modify event
              packages, pricing, and availability. Cancellation policies will be
              communicated at the time of booking.
            </p>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              11. Disclaimer of Warranties
            </h2>
            <p>
              This website and all services are provided "as is" and "as
              available" without warranties of any kind, express or implied.
              Speedway 146 and TaylorURL disclaim all warranties, including
              implied warranties of merchantability, fitness for a particular
              purpose, and non-infringement.
            </p>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              12. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, Speedway 146 and TaylorURL
              shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising from your use of the
              website or services, regardless of the theory of liability.
            </p>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              13. Indemnification
            </h2>
            <p>
              You agree to indemnify and hold harmless Speedway 146, TaylorURL,
              and their respective owners, employees, and agents from any
              claims, damages, losses, or expenses arising from your use of the
              website or violation of these terms.
            </p>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              14. Governing Law
            </h2>
            <p>
              These terms are governed by the laws of the State of Texas. Any
              disputes arising from these terms or your use of our services
              shall be resolved in the courts of Harris County, Texas.
            </p>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              15. Changes to Terms
            </h2>
            <p>
              Speedway 146 reserves the right to modify these terms at any time
              without prior notice. Changes are effective immediately upon
              posting. Your continued use of the website after any changes
              constitutes acceptance of the revised terms.
            </p>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 pl-4 border-l-4 border-red-600">
              16. Contact Us
            </h2>
            <p>
              If you have questions about these Terms of Service, please contact
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
              to="/privacy"
              className="group inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-bold transition-colors"
            >
              View Privacy Policy
              <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  </div>
);
export default TermsPage;
