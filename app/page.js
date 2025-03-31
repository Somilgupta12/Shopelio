"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Star, ArrowRight, Loader2, ChevronLeft, ChevronRight, X, ShoppingCart, Heart, Eye, MessageCircle, Phone, Mail, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWishlist } from './context/WishlistContext';

// Function to fetch products by category
const fetchProductsByCategory = async (category) => {
  try {
    const url = `/api/products?category=${encodeURIComponent(category)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    
    // If no products found with the exact category name, try alternative names
    if (data.length === 0 && category === 'Electronics') {
      // Try alternative spellings
      const alternativeUrl = `/api/products?category=${encodeURIComponent('Electronic')}`;
      const alternativeResponse = await fetch(alternativeUrl);
      if (alternativeResponse.ok) {
        const alternativeData = await alternativeResponse.json();
        if (!alternativeData.error && alternativeData.length > 0) {
          return alternativeData;
        }
      }
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${category} products:`, error);
    return [];
  }
};

// Function to fetch all products
const fetchProducts = async () => {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Product Quick View Modal Component
const QuickViewModal = ({ product, onClose }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  if (!product) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors z-10"
          >
            <X size={20} />
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="relative overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.image}
                alt={product.productName}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400';
                }}
              />
              <div className="absolute top-2 left-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                New
              </div>
            </div>
            
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.productName}</h2>
              
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < Math.round(product.rating || 0) ? "currentColor" : "none"}
                      className={i < Math.round(product.rating || 0) ? "" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {product.rating ? product.rating.toFixed(1) : "No ratings"}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              <div className="mb-6">
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-900">₹{product.price ? product.price.toFixed(2) : product.productPrice ? product.productPrice.toFixed(2) : "0.00"}</p>
                  {product.productPrice && product.productPrice !== product.price && (
                    <p className="text-sm text-gray-500 line-through">
                      ₹{product.productPrice.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-4 mb-6">
                <Link
                  href={`/products/${product._id}`}
                  className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors text-center"
                >
                  View Details
                </Link>
                <button
                  onClick={() => {
                    if (isInWishlist(product._id)) {
                      removeFromWishlist(product._id);
                      toast.success('Removed from wishlist');
                    } else {
                      addToWishlist(product);
                      toast.success('Added to wishlist');
                    }
                  }}
                  className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                    isInWishlist(product._id) 
                      ? 'bg-red-50 hover:bg-red-100' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart 
                    size={20} 
                    className={isInWishlist(product._id) ? 'text-red-500' : 'text-gray-600'} 
                    fill={isInWishlist(product._id) ? "currentColor" : "none"}
                  />
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <div className="w-24 font-medium">Category:</div>
                  <div>{product.category}</div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-24 font-medium">Availability:</div>
                  <div className="text-green-600">In Stock</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ label, value, icon, bgColor }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startValue = 0;
          const duration = 2000; // 2 seconds
          const increment = Math.ceil(value / (duration / 16)); // 60fps
          
          const timer = setInterval(() => {
            startValue += increment;
            if (startValue > value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(startValue);
            }
          }, 16);
          
          // Cleanup
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.1 }
    );
    
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    
    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [value]);
  
  return (
    <div 
      ref={counterRef}
      className={`${bgColor} rounded-lg p-6 text-center transform transition-transform hover:scale-105 hover:shadow-lg`}
    >
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <div className="text-3xl font-bold mb-2">{count.toLocaleString()}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
};

// Floating Help Button Component
// const FloatingHelpButton = () => {
//   const [isOpen, setIsOpen] = useState(false);
  
//   return (
//     <div className="fixed bottom-6 right-6 z-40">
//       {isOpen && (
//         <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-64 mb-2 animate-fade-in">
//           <div className="text-lg font-semibold mb-3">Need Help?</div>
//           <div className="space-y-3">
//             <a 
//               href="tel:+1234567890" 
//               className="flex items-center text-gray-700 hover:text-primary-600"
//             >
//               <Phone size={16} className="mr-2" />
//               <span>+1 (234) 567-890</span>
//             </a>
//             <a 
//               href="mailto:support@shopelio.com" 
//               className="flex items-center text-gray-700 hover:text-primary-600"
//             >
//               <Mail size={16} className="mr-2" />
//               <span>support@shopelio.com</span>
//             </a>
//             <button 
//               className="w-full mt-2 bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors"
//               onClick={() => toast.success('Live chat will be available soon!')}
//             >
//               Start Live Chat
//             </button>
//           </div>
//         </div>
//       )}
      
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className={`bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg transition-all ${isOpen ? 'rotate-45' : ''}`}
//         aria-label="Get help"
//       >
//         {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
//       </button>
//     </div>
//   );
// };

// Product Carousel Component
const ProductCarousel = ({ products, title, categoryLink }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(products.length / itemsPerSlide);
  
  const goToPrevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };
  
  const goToNextSlide = () => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };
  
  // If no products, don't render the carousel
  if (products.length === 0) return null;
  
  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">{title}</h3>
        <Link 
          href={categoryLink} 
          className="text-primary-600 hover:text-primary-700 flex items-center"
        >
          View All <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
      
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out" 
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0 flex space-x-6">
                {products
                  .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                  .map((product) => (
                    <div key={product._id} className="group flex-1 relative">
                      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                        <div className="relative overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.productName}
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/300';
                            }}
                          />
                          <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                            New
                          </div>
                          
                          {/* Product Actions Overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setQuickViewProduct(product);
                                }}
                                className="bg-white p-2 rounded-full hover:bg-primary-50 transition-colors transform hover:scale-110"
                                aria-label="Quick view"
                              >
                                <Eye size={18} className="text-primary-600" />
                              </button>
                              <Link
                                href={`/products/${product._id}`}
                                className="bg-white p-2 rounded-full hover:bg-primary-50 transition-colors transform hover:scale-110"
                                aria-label="View details"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ShoppingCart size={18} className="text-primary-600" />
                              </Link>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (isInWishlist(product._id)) {
                                    removeFromWishlist(product._id);
                                    toast.success('Removed from wishlist');
                                  } else {
                                    addToWishlist(product);
                                    toast.success('Added to wishlist');
                                  }
                                }}
                                className={`bg-white p-2 rounded-full hover:bg-primary-50 transition-colors transform hover:scale-110 ${
                                  isInWishlist(product._id) ? 'text-red-500' : 'text-primary-600'
                                }`}
                                aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                              >
                                <Heart size={18} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <Link href={`/products/${product._id}`} className="flex-grow flex flex-col p-4">
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                            {product.productName}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  fill={i < Math.round(product.rating || 0) ? "currentColor" : "none"}
                                  className={i < Math.round(product.rating || 0) ? "" : "text-gray-300"}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {product.rating ? product.rating.toFixed(1) : "No ratings"}
                            </span>
                          </div>
                          <div className="mt-auto">
                            <div className="mt-2 flex justify-between items-center">
                              <p className="text-sm font-medium text-gray-900">₹{product.price ? product.price.toFixed(2) : product.productPrice ? product.productPrice.toFixed(2) : "0.00"}</p>
                              {product.productPrice && product.productPrice !== product.price && (
                                <p className="text-sm text-gray-500 line-through">
                                  ₹{product.productPrice.toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation Arrows - only show if there are multiple slides */}
        {totalSlides > 1 && (
          <>
            <button 
              onClick={goToPrevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-10 bg-white shadow-lg rounded-full p-2 text-primary-600 hover:text-primary-700 transition-all"
              aria-label="Previous products"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={goToNextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-10 bg-white shadow-lg rounded-full p-2 text-primary-600 hover:text-primary-700 transition-all"
              aria-label="Next products"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
      
      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      )}
    </div>
  );
};

const Home = () => {
  const [productsByCategory, setProductsByCategory] = useState({
    electronics: [],
    fashion: [],
    homeLiving: []
  });
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [seeding, setSeeding] = useState(false);

  // Carousel slides data
  const carouselSlides = [
    {
      id: 1,
      title: "Welcome to Shopelio",
      subtitle: "Discover amazing products at great prices",
      buttonText: "Shop Now",
      buttonLink: "/products",
      bgColor: "from-blue-500 to-purple-600",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 2,
      title: "New Electronics Collection",
      subtitle: "Latest gadgets and devices for tech enthusiasts",
      buttonText: "Explore Electronics",
      buttonLink: "/category/electronics",
      bgColor: "from-indigo-600 to-blue-400",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 3,
      title: "Fashion Trends 2023",
      subtitle: "Upgrade your style with our latest fashion collection",
      buttonText: "View Fashion",
      buttonLink: "/category/fashion",
      bgColor: "from-pink-500 to-rose-400",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  // Handle manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1));
  };

  // Function to seed the database with sample products
  const seedDatabase = async () => {
    try {
      setSeeding(true);
      const response = await fetch('/api/seed');
      if (!response.ok) {
        throw new Error('Failed to seed database');
      }
      const data = await response.json();
      toast.success(`Database seeded with ${data.count} products`);
      
      // Reload products after seeding
      loadProductsByCategory();
    } catch (error) {
      console.error('Error seeding database:', error);
      toast.error('Failed to seed database');
    } finally {
      setSeeding(false);
    }
  };

  const loadProductsByCategory = async () => {
    try {
      setLoading(true);
      
      // Fetch products for each category
      const [electronicsProducts, fashionProducts, homeLivingProducts] = await Promise.all([
        fetchProductsByCategory('Electronics'),
        fetchProductsByCategory('Fashion'),
        fetchProductsByCategory('Home & Living')
      ]);
      
      // Log the results for debugging
      console.log('Electronics products:', electronicsProducts.length);
      console.log('Fashion products:', fashionProducts.length);
      console.log('Home & Living products:', homeLivingProducts.length);
      
      setProductsByCategory({
        electronics: electronicsProducts.slice(0, 6), // Limit to 6 products per category
        fashion: fashionProducts.slice(0, 6),
        homeLiving: homeLivingProducts.slice(0, 6)
      });
    } catch (error) {
      console.error('Failed to load products by category:', error);
      toast.error('Failed to load featured products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductsByCategory();
  }, []);

  return (
    <div>
      {/* Admin Tools - Only visible in development */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 p-4 border-b">
          <div className="container mx-auto flex justify-end">
            <button
              onClick={seedDatabase}
              disabled={seeding}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center"
            >
              {seeding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Seeding...
                </>
              ) : (
                'Seed Database'
              )}
            </button>
          </div>
        </div>
      )} */}

      {/* Hero Carousel Section */}
      <div className="relative h-[300px] md:h-[330px] overflow-hidden">
        {carouselSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} opacity-70`}></div>
            </div>
            
            {/* Content */}
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 transform transition-transform animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl mb-8 opacity-90 animate-fade-in-delay">
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.buttonLink}
                  className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 animate-fade-in-delay-2"
                >
                  {slide.buttonText}
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button 
          onClick={goToPrevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={goToNextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white transition-all"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <AnimatedCounter 
              label="Happy Customers" 
              value={15000} 
              icon={<ShoppingCart size={32} className="text-blue-500" />}
              bgColor="bg-blue-50"
            />
            <AnimatedCounter 
              label="Products Available" 
              value={2500} 
              icon={<Star size={32} className="text-yellow-500" />}
              bgColor="bg-yellow-50"
            />
            <AnimatedCounter 
              label="Orders Delivered" 
              value={25000} 
              icon={<ArrowRight size={32} className="text-green-500" />}
              bgColor="bg-green-50"
            />
            <AnimatedCounter 
              label="Years of Experience" 
              value={10} 
              icon={<MessageCircle size={32} className="text-purple-500" />}
              bgColor="bg-purple-50"
            />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/category/electronics" className="group relative">
              <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 text-center p-10 transform hover:-translate-y-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-100 rounded-full w-16 h-16 mx-auto blur-2xl opacity-30"></div>
                  <div className="text-5xl mb-6 text-primary-600 mx-auto relative">🖥️</div>
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary-600 transition-colors mb-3">Electronics</h3>
                <p className="mt-2 text-gray-600 text-sm">Latest gadgets and devices</p>
                <div className="absolute bottom-0 left-0 h-1 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 w-full"></div>
              </div>
            </Link>
            <Link href="/category/fashion" className="group relative">
              <div className="bg-gradient-to-br from-rose-50 to-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 text-center p-10 transform hover:-translate-y-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-rose-100 rounded-full w-16 h-16 mx-auto blur-2xl opacity-30"></div>
                  <div className="text-5xl mb-6 text-primary-600 mx-auto relative">👕</div>
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary-600 transition-colors mb-3">Fashion</h3>
                <p className="mt-2 text-gray-600 text-sm">Trendy clothes and accessories</p>
                <div className="absolute bottom-0 left-0 h-1 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 w-full"></div>
              </div>
            </Link>
            <Link href="/category/home-living" className="group relative">
              <div className="bg-gradient-to-br from-green-50 to-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 text-center p-10 transform hover:-translate-y-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-100 rounded-full w-16 h-16 mx-auto blur-2xl opacity-30"></div>
                  <div className="text-5xl mb-6 text-primary-600 mx-auto relative">🏠</div>
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary-600 transition-colors mb-3">Home & Living</h3>
                <p className="mt-2 text-gray-600 text-sm">Furniture and home decor</p>
                <div className="absolute bottom-0 left-0 h-1 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 w-full"></div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Products</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              <p className="ml-2">Loading products...</p>
            </div>
          ) : (
            <div>
              {/* Electronics Products Carousel */}
              <ProductCarousel 
                products={productsByCategory.electronics} 
                title="Electronics" 
                categoryLink="/category/electronics" 
              />
              
              {/* Fashion Products Carousel */}
              <ProductCarousel 
                products={productsByCategory.fashion} 
                title="Fashion" 
                categoryLink="/category/fashion" 
              />
              
              {/* Home & Living Products Carousel */}
              <ProductCarousel 
                products={productsByCategory.homeLiving} 
                title="Home & Living" 
                categoryLink="/category/home-living" 
              />
              
              {/* Show message if no products in any category */}
              {Object.values(productsByCategory).every(products => products.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No featured products available at the moment.</p>
                  <Link 
                    href="/products" 
                    className="mt-4 inline-block text-primary-600 hover:text-primary-700"
                  >
                    View all products
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Floating Help Button */}
      {/* <FloatingHelpButton /> */}
    </div>
  );
};

export default Home;