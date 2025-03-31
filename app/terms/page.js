"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const TermsOfServicePage = () => {
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
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Terms of Service</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-gray-600 mb-4">Last Updated: June 30, 2024</p>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Shopelio. These Terms of Service (&quot;Terms&quot;) govern your use of our website, services, and mobile applications (collectively, the &quot;Services&quot;). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.
            </p>
            <p>
              Our Privacy Policy also governs your use of our Services and is incorporated by reference into these Terms. Please review our Privacy Policy to understand our data practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Account Registration</h2>
            <p className="mb-4">
              To access certain features of our Services, you may need to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <p className="mb-4">
              You are responsible for safeguarding your password and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account or any other breach of security.
            </p>
            <p>
              We reserve the right to disable any user account at any time in our sole discretion, including if we believe that you have violated these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Products and Purchases</h2>
            <p className="mb-4">
              Product descriptions, prices, and availability are subject to change without notice. We reserve the right to modify, discontinue, or otherwise change any product at any time without prior notice.
            </p>
            <p className="mb-4">
              All purchases made through our Services are subject to our order acceptance. We may, in our sole discretion, refuse to accept an order, limit quantities, or cancel an order for any reason.
            </p>
            <p>
              Prices for products are subject to change. We are not responsible for typographical or pricing errors and reserve the right to correct any errors in pricing.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Shipping and Delivery</h2>
            <p className="mb-4">
              Delivery dates are estimates only and are not guaranteed. We are not responsible for delays in delivery caused by carriers or other events beyond our control.
            </p>
            <p>
              Risk of loss and title for items purchased from our Services pass to you upon delivery of the items to the carrier. You are responsible for filing any claims with carriers for damaged and/or lost shipments.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Returns and Refunds</h2>
            <p className="mb-4">
              Our return and refund policy is outlined separately and is incorporated by reference into these Terms. By making a purchase through our Services, you agree to be bound by our return and refund policy.
            </p>
            <p>
              We reserve the right to modify our return and refund policy at any time. Any changes to our return and refund policy will be posted on our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. User Content</h2>
            <p className="mb-4">
              By submitting, posting, or displaying content on or through our Services (including product reviews, comments, or other content), you grant us a non-exclusive, royalty-free, worldwide, fully paid, and sublicensable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content in any media.
            </p>
            <p className="mb-4">
              You represent and warrant that you have all rights necessary to grant the licenses above and that your content does not violate any law, regulation, or right of any third party.
            </p>
            <p>
              We reserve the right to remove any content that violates these Terms or that we otherwise find objectionable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Intellectual Property</h2>
            <p className="mb-4">
              The Services and all content and materials included on the Services, including, but not limited to, text, graphics, logos, button icons, images, audio clips, and software, are the property of Shopelio or its licensors and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              You may not use, reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Services, except as generally and ordinarily permitted through the Services according to these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Prohibited Uses</h2>
            <p>
              You agree not to use the Services:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>In any way that violates any applicable law or regulation</li>
              <li>To impersonate or attempt to impersonate Shopelio, a Shopelio employee, another user, or any other person or entity</li>
              <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Services</li>
              <li>To attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Services, the server on which the Services are stored, or any server, computer, or database connected to the Services</li>
              <li>To attack the Services via a denial-of-service attack or a distributed denial-of-service attack</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">9. Disclaimer of Warranties</h2>
            <p className="mb-4">
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p>
              WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICES OR THE SERVER THAT MAKES THEM AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">10. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL SHOPELIO, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SERVICES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of the Services after the posting of revised Terms means that you accept and agree to the changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">12. Contact Information</h2>
            <p>
              Questions or comments about the Services or these Terms may be directed to our customer service department by emailing support@shopelio.com or by calling us at 1-800-SHOPELIO.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage; 