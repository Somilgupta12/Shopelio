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
  specifications: String,
  stock: {
    type: Number,
    default: 0
  },
  reviews: [String],
  rating: Number,
});

// Get the Product model
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const searchQuery = searchParams.get('search');
    
    let query = {};
    
    // Add category filter if provided
    if (category) {
      query.category = category;
    }
    
    // Add search query if provided
    if (searchQuery) {
      // Use case-insensitive regex search on product name
      query.productName = { $regex: searchQuery, $options: 'i' };
    }
    
    const products = await Product.find(query).sort({ _id: -1 }); // Sort by newest first
    
    // Convert MongoDB documents to plain objects and stringify ObjectIds
    const serializedProducts = products.map(product => {
      const plainProduct = product.toObject();
      plainProduct._id = plainProduct._id.toString();
      // Ensure specifications is a string
      plainProduct.specifications = plainProduct.specifications || '';
      // Ensure stock is a number
      plainProduct.stock = Number(plainProduct.stock) || 0;
      return plainProduct;
    });
    
    return NextResponse.json(serializedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 