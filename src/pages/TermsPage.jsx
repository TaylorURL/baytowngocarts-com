import React from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const TermsPage = () => (
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
          <FileText className="h-16 w-16 mx-auto mb-6 text-gray-300" />
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
            Terms of <span className="text-red-500">Service</span>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              4. Purchases and Payments
            </h2>
            <ul className="list-disc pl-6 space-y-2">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              6. Data Usage and Consent
            </h2>
            <p>
              By using this website and our services, you consent to the
              collection, storage, and use of your personal data by both
              Speedway 146 and TaylorURL (the website developer and operator).
            </p>
            <ul className="list-disc pl-6 space-y-2">
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
                className="text-red-600 hover:text-red-700 font-bold"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              8. User Conduct
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              14. Governing Law
            </h2>
            <p>
              These terms are governed by the laws of the State of Texas. Any
              disputes arising from these terms or your use of our services
              shall be resolved in the courts of Harris County, Texas.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              16. Contact Us
            </h2>
            <p>
              If you have questions about these Terms of Service, please contact
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
              to="/privacy"
              className="text-red-600 hover:text-red-700 font-bold transition-colors"
            >
              View Privacy Policy →
            </Link>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default TermsPage;
