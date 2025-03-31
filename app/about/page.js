import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">About ShopHub</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2024, ShopHub has grown from a small startup to one of the leading e-commerce platforms. Our mission is to provide customers with high-quality products at competitive prices while delivering exceptional shopping experiences.
          </p>
          <p className="text-gray-600">
            We work directly with manufacturers and brands to ensure authenticity and maintain high standards for all products available on our platform.
          </p>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400"
            alt="Team meeting"
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">10M+</h3>
          <p className="text-gray-600">Happy Customers</p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">50K+</h3>
          <p className="text-gray-600">Products Available</p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">100+</h3>
          <p className="text-gray-600">Countries Served</p>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-2">Quality First</h3>
            <p className="text-gray-600">
              We ensure all products meet our high standards for quality and authenticity.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Customer Focus</h3>
            <p className="text-gray-600">
              Our customers are at the heart of everything we do.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Innovation</h3>
            <p className="text-gray-600">
              We continuously improve our platform and services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;