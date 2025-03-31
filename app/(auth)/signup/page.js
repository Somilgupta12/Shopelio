"use client";
import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { signup } from '@/actions/user.action';

export const dynamic = 'force-dynamic';

// Main component content
const SignupContent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    hasNumber: false,
    hasUppercase: false,
    hasSpecialChar: false
  });

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  // Check password strength
  const checkPasswordStrength = (password) => {
    const strength = {
      length: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    setPasswordStrength(strength);
    
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (!strength.length) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    } else if (!(strength.hasNumber && strength.hasUppercase && strength.hasSpecialChar)) {
      setPasswordError('Password must include uppercase, number, and special character');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  // Validate confirm password
  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    } else {
      setConfirmPasswordError('');
      return true;
    }
  };

  // Handle email change
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail) validateEmail(newEmail);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword) {
      checkPasswordStrength(newPassword);
      // Also validate confirm password if it exists
      if (confirmPassword) {
        validateConfirmPassword(confirmPassword);
      }
    }
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (newConfirmPassword) {
      validateConfirmPassword(newConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    const isEmailValid = validateEmail(email);
    const isPasswordValid = checkPasswordStrength(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await signup(email, password);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      // Store email temporarily for the login page
      localStorage.setItem('pendingUserEmail', email);
      
      toast.success('Account created successfully! Please log in with your credentials.');
      
      router.push('/login?newSignup=true');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-5">
          <h1 className="text-3xl font-bold text-primary-600">Shopelio</h1>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => validateEmail(email)}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    emailError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm focus:outline-none`}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => checkPasswordStrength(password)}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    passwordError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm focus:outline-none`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-2 text-gray-500 hover:text-gray-900"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
              
              {/* Password strength indicators */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium text-gray-700">Password must contain:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    <div className="flex items-center">
                      {passwordStrength.length ? (
                        <CheckCircle size={14} className="text-green-500 mr-1" />
                      ) : (
                        <XCircle size={14} className="text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${passwordStrength.length ? 'text-green-600' : 'text-gray-500'}`}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center">
                      {passwordStrength.hasUppercase ? (
                        <CheckCircle size={14} className="text-green-500 mr-1" />
                      ) : (
                        <XCircle size={14} className="text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${passwordStrength.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                        One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center">
                      {passwordStrength.hasNumber ? (
                        <CheckCircle size={14} className="text-green-500 mr-1" />
                      ) : (
                        <XCircle size={14} className="text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                        One number
                      </span>
                    </div>
                    <div className="flex items-center">
                      {passwordStrength.hasSpecialChar ? (
                        <CheckCircle size={14} className="text-green-500 mr-1" />
                      ) : (
                        <XCircle size={14} className="text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                        One special character
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  onBlur={() => validateConfirmPassword(confirmPassword)}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    confirmPasswordError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm focus:outline-none`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-2 text-gray-500 hover:text-gray-900"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="mt-1 text-sm text-red-600">{confirmPasswordError}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || emailError || passwordError || confirmPasswordError}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component with Suspense boundary
const Signup = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
};

export default Signup; 