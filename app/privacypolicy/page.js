"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-primary-600 text-sm">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Privacy Policy</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-4">Last Updated: June 30, 2024</p>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
            <p className="mb-4">
              Shopelio ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services, including our mobile application (collectively, the "Services").
            </p>
            <p>
              Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
            <p className="mb-4">
              We may collect personal information that you voluntarily provide to us when you register with us, express an interest in obtaining information about us or our products and Services, participate in activities on the Services, or otherwise contact us.
            </p>
            <p className="mb-4">
              The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Personal Identifiers: Name, email address, postal address, phone number.</li>
              <li>Account Information: Username, password, account preferences.</li>
              <li>Payment Information: Credit card details, billing address, purchase history.</li>
              <li>Profile Data: Your preferences, feedback, and survey responses.</li>
              <li>Usage Data: Information about how you use our website and services.</li>
              <li>Device Information: Information about your device, IP address, browser type.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>To provide, operate, and maintain our Services.</li>
              <li>To improve, personalize, and expand our Services.</li>
              <li>To understand and analyze how you use our Services.</li>
              <li>To develop new products, services, features, and functionality.</li>
              <li>To communicate with you, including for customer service, updates, and marketing purposes.</li>
              <li>To process your transactions and manage your account.</li>
              <li>To find and prevent fraud and respond to trust and safety issues.</li>
              <li>For compliance purposes, including enforcing our Terms of Service or other legal rights.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. How We Share Your Information</h2>
            <p className="mb-4">
              We may share your information with third parties in the following situations:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Business Partners:</strong> We may share your information with our business partners to offer you certain products, services, or promotions.</li>
              <li><strong>Service Providers:</strong> We may share your information with service providers who perform services for us, such as payment processing, data analysis, email delivery, hosting services, and customer service.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information where required to do so by law or in response to valid requests by public authorities.</li>
              <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with a merger, sale of company assets, financing, or acquisition of all or a portion of our business.</li>
              <li><strong>With Your Consent:</strong> We may share your information with third parties when you have given us your consent to do so.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to track activity on our Services and store certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
            </p>
            <p className="mb-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Services.
            </p>
            <p>
              We use both session cookies and persistent cookies. Session cookies are temporary and are deleted when you close your browser, while persistent cookies remain on your device until they expire or you delete them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Data Security</h2>
            <p className="mb-4">
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
            </p>
            <p>
              Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Data Retention</h2>
            <p>
              We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Your Privacy Rights</h2>
            <p className="mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>The right to access the personal information we have about you.</li>
              <li>The right to request that we correct any inaccurate personal information we have about you.</li>
              <li>The right to request that we delete any personal information we have about you.</li>
              <li>The right to object to processing of your personal information.</li>
              <li>The right to data portability.</li>
              <li>The right to withdraw consent at any time where we relied on your consent to process your personal information.</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the contact information provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">9. Children's Privacy</h2>
            <p>
              Our Services are not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us. If we become aware that we have collected personal information from a child under 13 without verification of parental consent, we will take steps to remove that information from our servers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">10. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-4">
              <p>Email: shipping@shopelio.com</p>
              <p>Phone: +91 9876543210</p>
              <p>Address: Sadar Bazar, New Delhi, Delhi, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;