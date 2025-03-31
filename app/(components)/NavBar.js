"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, User, Menu, X, LogOut, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const NavBar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const { getCartItemsCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { getWishlistCount } = useWishlist();
  
  const cartItemCount = getCartItemsCount();
  const wishlistCount = getWishlistCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when window is resized to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
        setShowSearch(false);
        setIsAccountMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isAccountMenuOpen && !event.target.closest('.account-menu-container')) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccountMenuOpen]);

  // Handle search submission
  const handleSearch = (e, isMobile = false) => {
    e.preventDefault();
    const query = isMobile ? mobileSearchQuery : searchQuery;
    
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      
      // Reset search states
      if (isMobile) {
        setMobileSearchQuery('');
        setShowSearch(false);
      } else {
        setSearchQuery('');
        setSearchFocused(false);
      }
    }
  };

  // Handle key press for search
  const handleKeyPress = (e, isMobile = false) => {
    if (e.key === 'Enter') {
      handleSearch(e, isMobile);
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/80 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Main Navbar */}
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link 
              href="/" 
              className="flex items-center space-x-2"
            >
              <Image
                src="/images/Shopeliobg.png"
                alt="Shopelio Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
                Shopelio
              </span>
            </Link>

            {/* Desktop Navigation - Now part of left section */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link 
                href="/category/electronics" 
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Electronics
              </Link>
              <Link 
                href="/category/fashion" 
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Fashion
              </Link>
              <Link 
                href="/category/home-living" 
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Home & Living
              </Link>
            </div>
          </div>

          {/* Center Section: Search */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <form onSubmit={(e) => handleSearch(e, false)} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, false)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-lg transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
                <button 
                  type="submit" 
                  className="absolute left-2 top-1.5 text-gray-400 hover:text-primary-500 transition-colors"
                  aria-label="Search"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-1 md:space-x-4">
            {/* Mobile Search Toggle */}
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Toggle search"
            >
              <Search size={20} />
            </button>
            
            {/* Wishlist */}
            <Link 
              href="/wishlist" 
              className="flex items-center hover:text-primary-600 transition-colors group p-2 relative"
            >
              <Heart className="group-hover:scale-110 transition-transform" size={20} />
              <span className="hidden md:inline ml-1">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            {/* Cart */}
            <Link 
              href="/cart" 
              className="flex items-center hover:text-primary-600 transition-colors group p-2 relative"
            >
              <ShoppingCart className="group-hover:scale-110 transition-transform" size={20} />
              <span className="hidden md:inline ml-1">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {/* Account */}
            <div className="relative account-menu-container">
              <button 
                className="flex items-center hover:text-primary-600 transition-colors group p-2"
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              >
                <User className="group-hover:scale-110 transition-transform" size={20} />
                <span className="hidden md:inline ml-1">
                  {isAuthenticated ? user.email.split('@')[0] : 'Account'}
                </span>
              </button>
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium truncate">{user.email}</p>
                      </div>
                      <Link 
                        href="/orders" 
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <button 
                        className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition-colors"
                        onClick={() => {
                          logout();
                          setIsAccountMenuOpen(false);
                        }}
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/login" 
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link 
                        href="/register" 
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            showSearch ? 'max-h-20 py-4' : 'max-h-0'
          }`}
        >
          <form onSubmit={(e) => handleSearch(e, true)}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, true)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
              <button 
                type="submit" 
                className="absolute left-3 top-2.5 text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-48' : 'max-h-0'
          }`}
        >
          <div className="py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/category/electronics" 
                className="px-4 py-2 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Electronics
              </Link>
              <Link 
                href="/category/fashion" 
                className="px-4 py-2 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Fashion
              </Link>
              <Link 
                href="/category/home-living" 
                className="px-4 py-2 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home & Living
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;