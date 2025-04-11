"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const ShippingInformationPage = () => {
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
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Shipping Information</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Shipping Information</h1>
        <p className="text-gray-600 mb-4">Last Updated: June 30, 2024</p>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Shipping Methods</h2>
            <p className="mb-4">
              Shopelio offers several shipping options to meet your needs. Available shipping methods may vary based on your location, the items in your order, and the delivery address.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">Shipping Method</th>
                    <th className="py-2 px-4 border-b text-left">Estimated Delivery Time</th>
                    <th className="py-2 px-4 border-b text-left">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b">Standard Shipping</td>
                    <td className="py-2 px-4 border-b">5-7 business days</td>
                    <td className="py-2 px-4 border-b">₹99 (Free on orders above ₹999)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">Express Shipping</td>
                    <td className="py-2 px-4 border-b">2-3 business days</td>
                    <td className="py-2 px-4 border-b">₹199</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">Next Day Delivery</td>
                    <td className="py-2 px-4 border-b">1 business day (order before 2 PM)</td>
                    <td className="py-2 px-4 border-b">₹349</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Business days are Monday through Friday, excluding holidays. Orders placed after 2 PM may be processed the following business day.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Delivery Areas</h2>
            <p className="mb-4">
              We currently ship to all major cities and towns across India. However, some remote areas may experience longer delivery times or may not be serviceable.
            </p>
            <p className="mb-4">
              For international shipping, we currently serve the following regions:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Mumbai, Maharashtra</li>
              <li>New Delhi, Delhi</li>
              <li>Kerala</li>
              <li>Madhya Pradesh</li>
              <li>Gujarat</li>
              <li>Rajasthan</li>
              <li>Haryana</li>
              <li>Punjab</li>
              <li>Uttar Pradesh</li>
              <li>Uttarakhand</li>
            </ul>
            <p>
              International shipping rates and delivery times vary based on destination and package weight. These details will be calculated at checkout.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Order Processing</h2>
            <p className="mb-4">
              All orders are processed within 1-2 business days after payment confirmation. Orders placed on weekends or holidays will be processed on the next business day.
            </p>
            <p className="mb-4">
              During peak seasons (like major sales events or holidays), processing times may be slightly longer. We&apos;ll always inform you if there are any significant delays.
            </p>
            <p>
              For custom or pre-order items, additional processing time may be required. The estimated shipping date will be communicated at the time of purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Tracking Your Order</h2>
            <p className="mb-4">
              Once your order ships, you will receive a shipping confirmation email with a tracking number. You can track your package&apos;s status in real-time by:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Logging into your Shopelio account and viewing the order details</li>
              <li>Clicking the tracking link in your shipping confirmation email</li>
              <li>Contacting our customer service with your order number</li>
            </ul>
            <p>
              Please note that it may take up to 24 hours after receiving your shipping confirmation for tracking information to become active.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Shipping Delays</h2>
            <p className="mb-4">
              While we strive to deliver all orders on time, occasional delays may occur due to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Extreme weather conditions</li>
              <li>Natural disasters</li>
              <li>Customs delays (for international shipments)</li>
              <li>Carrier service disruptions</li>
              <li>Incorrect or incomplete shipping address</li>
            </ul>
            <p>
              In case of any significant delay, we will notify you via email or SMS with updated delivery estimates.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Shipping Address</h2>
            <p className="mb-4">
              It is your responsibility to provide an accurate and complete shipping address. Shopelio is not responsible for packages delivered to the wrong address due to incorrectly provided shipping information.
            </p>
            <p>
              If you need to update your shipping address after placing an order, please contact our customer service immediately. We&apos;ll do our best to update the address if the order hasn&apos;t been processed yet.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Customs & Import Duties</h2>
            <p className="mb-4">
              For international shipments, you may be subject to import duties and taxes when your package reaches its destination. These fees are determined by the customs office of the destination country and are the responsibility of the recipient.
            </p>
            <p>
              Shopelio does not collect these fees at checkout and cannot predict what these charges might be. Please contact your local customs office for more information before placing an order.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Shipping Insurance</h2>
            <p className="mb-4">
              All orders are shipped with basic insurance coverage against loss or damage during transit. Express and Next Day shipping options include additional insurance coverage.
            </p>
            <p>
              If your package arrives damaged, please refuse delivery or contact our customer service within 48 hours of delivery with photos of the damaged package and products.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">9. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about our Shipping Policy, please contact us:
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

export default ShippingInformationPage;