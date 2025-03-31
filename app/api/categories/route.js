import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';

// Define the product schema
const productSchema = new mongoose.Schema({
  productName: String,
  productPrice: Number,
  category: String,
  price: Number,
  description: String,
  image: String,
  specifications: [String],
  stock: Number,
  reviews: [String],
  rating: Number,
});

// Get the Product model
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export async function GET() {
  try {
    await connectDB();
    
    // Get all unique categories
    const categories = await Product.distinct('category');
    
    // Filter out null or empty categories
    const validCategories = categories.filter(category => category && category.trim() !== '');
    
    // Add 'Uncategorized' if there are products without a category
    const productsWithoutCategory = await Product.countDocuments({ 
      $or: [
        { category: null },
        { category: '' },
        { category: { $exists: false } }
      ] 
    });
    
    if (productsWithoutCategory > 0 && !validCategories.includes('Uncategorized')) {
      validCategories.push('Uncategorized');
    }
    
    // Add default categories if they don't exist
    const defaultCategories = ['Fashion', 'Home & Living'];
    defaultCategories.forEach(category => {
      if (!validCategories.includes(category)) {
        validCategories.push(category);
      }
    });
    
    // Sort categories alphabetically
    validCategories.sort();
    
    return NextResponse.json(validCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 