"use server";

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true };
};

const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }
  return { isValid: true };
};

export const login = async (email, password) => {
  try {
    // Validate input
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return { error: emailValidation.error };
    }
    
    if (!password) {
      return { error: 'Password is required' };
    }
    
    await connectDB();
    
    const user = await User.findOne({ email });
    if (!user) {
      return { error: 'Invalid email or password' };
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return { error: 'Invalid email or password' };
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    const token = user.generateAuthToken();
    return { 
      user: { 
        email: user.email, 
        _id: user._id.toString() 
      }, 
      token 
    };
  } catch (error) {
    console.error('Server login error:', error);
    return { error: 'An error occurred during login' };
  }
};

export const signup = async (email, password) => {
  try {
    // Validate input
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return { error: emailValidation.error };
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return { error: passwordValidation.error };
    }
    
    await connectDB();
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: 'Email already in use' };
    }

    const user = new User({ email, password });
    await user.save();

    const token = user.generateAuthToken();
    return { 
      user: { 
        email: user.email, 
        _id: user._id.toString() 
      }, 
      token 
    };
  } catch (error) {
    console.error('Server signup error:', error);
    if (error.name === 'ValidationError') {
      // Extract mongoose validation error message
      const errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
      return { error: errorMessage };
    }
    return { error: 'An error occurred during signup' };
  }
};

// Get user ID by email
export const getUserIdByEmail = async (email) => {
  try {
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return { error: emailValidation.error };
    }
    
    await connectDB();
    
    const user = await User.findOne({ email });
    if (!user) {
      return { error: 'User not found' };
    }
    
    return { userId: user._id.toString() };
  } catch (error) {
    console.error('Error retrieving user ID:', error);
    return { error: 'An error occurred while retrieving user ID' };
  }
};
