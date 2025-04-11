"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const ReturnPolicyPage = () => {
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
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Return Policy</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Return Policy</h1>
        <p className="text-gray-600 mb-4">Last Updated: June 30, 2024</p>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Return Eligibility</h2>
            <p className="mb-4">
              We want you to be completely satisfied with your purchase. If you are not entirely satisfied, we are here to help.
            </p>
            <p className="mb-4">
              You may return most new, unopened items within 30 days of delivery for a full refund. We also accept returns for opened items within 14 days of delivery if the item is defective or damaged upon arrival.
            </p>
            <p>
              To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in the original packaging.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Non-Returnable Items</h2>
            <p className="mb-4">
              Certain types of items cannot be returned, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Gift cards</li>
              <li>Downloadable software products</li>
              <li>Personal care items (for hygiene reasons)</li>
              <li>Customized or personalized products</li>
              <li>Perishable goods</li>
              <li>Items marked as "Final Sale" or "Non-Returnable"</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Return Process</h2>
            <p className="mb-4">
              To start a return, please follow these steps:
            </p>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">Log in to your account and navigate to the "My Orders" section</li>
              <li className="mb-2">Find the order containing the item(s) you wish to return</li>
              <li className="mb-2">Click on "Return Items" and select the products you want to return</li>
              <li className="mb-2">Choose a reason for the return from the dropdown menu</li>
              <li className="mb-2">Select your preferred refund method</li>
              <li>Print the return shipping label (if applicable)</li>
            </ol>
            <p>
              Alternatively, you can contact our customer service team at returns@shopelio.com or call 1-800-SHOPELIO for assistance with your return.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Return Shipping</h2>
            <p className="mb-4">
              You are responsible for paying the shipping costs for returning your item. The original shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
            </p>
            <p className="mb-4">
              However, if the item is defective, damaged upon arrival, or if we sent you the wrong item, we will cover the return shipping costs and issue a full refund including the original shipping charges.
            </p>
            <p>
              To receive a prepaid shipping label for eligible returns, please contact our customer service team.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Refunds</h2>
            <p className="mb-4">
              Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
            </p>
            <p className="mb-4">
              If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days. Please note that depending on your credit card company, it may take an additional 2-10 business days for the refund to show in your account.
            </p>
            <p>
              For items that are damaged, defective, or incorrect, we will process a full refund including the original shipping costs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Late or Missing Refunds</h2>
            <p className="mb-4">
              If you haven't received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted.
            </p>
            <p className="mb-4">
              Next, contact your bank. There is often some processing time before a refund is posted.
            </p>
            <p>
              If you've done all of this and you still have not received your refund, please contact our customer service team at refunds@shopelio.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Exchanges</h2>
            <p className="mb-4">
              We only replace items if they are defective or damaged upon delivery. If you need to exchange an item for the same one, send us an email at exchanges@shopelio.com and we will guide you through the process.
            </p>
            <p>
              If you would like to exchange an item for a different product or size, please return the original item for a refund and place a new order for the desired item.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Sale Items</h2>
            <p>
              Only regular priced items may be refunded. Sale items cannot be refunded unless they are defective or damaged upon arrival. Please note that items marked as "Clearance," "Final Sale," or "As Is" cannot be returned under any circumstances unless they arrive damaged or defective.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">9. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about our Return Policy, please contact us:
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

export default ReturnPolicyPage;