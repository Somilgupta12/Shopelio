"use server";
import mongoose from 'mongoose';
import connectDB from '@/lib/db';

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  productPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  specifications: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
    get: v => Math.floor(v || 0),
    set: v => Math.floor(v || 0)
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Calculate average rating before saving
productSchema.pre('save', function(next) {
  // Ensure stock is always an integer
  if (this.isModified('stock')) {
    this.stock = Math.floor(this.stock || 0);
  }
  
  // Calculate average rating
  if (this.reviews.length > 0) {
    this.rating = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
  }
  next();
});

// Use existing model or create a new one
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Helper function to serialize a product
const serializeProduct = (product) => {
  if (!product) return null;
  
  const serialized = {
    _id: product._id.toString(),
    productName: product.productName,
    description: product.description,
    specifications: product.specifications || '',
    price: Number(product.price) || 0,
    productPrice: Number(product.productPrice) || 0,
    category: product.category,
    image: product.image,
    stock: Number(product.stock) || 0,
    rating: product.rating || 0,
    reviews: product.reviews || [],
  };
  
  return serialized;
};

export const getAllProducts = async () => {
  try {
    await connectDB();
    const products = await Product.find().sort({ _id: -1 });
    return products.map(product => serializeProduct(product));
  } catch (error) {
    console.error('Error fetching all products:', error);
    return { error: error.message || 'Failed to fetch products' };
  }
};

export const createProduct = async (productData) => {
  try {
    await connectDB();
    
    // Format the data
    const formattedData = {
      ...productData,
      stock: Math.floor(productData.stock || 0),
      price: Number(productData.price) || 0,
      productPrice: Number(productData.productPrice) || 0,
      rating: Number(productData.rating) || 0
    };

    const product = new Product(formattedData);
    await product.save();
    return serializeProduct(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return { error: error.message || 'Failed to create product' };
  }
};

export const getProductById = async (id) => {
  try {
    await connectDB();
    const product = await Product.findById(id);
    if (!product) {
      return { error: 'Product not found' };
    }
    return serializeProduct(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return { error: error.message || 'Failed to fetch product' };
  }
};

export const updateProduct = async (id, updateData) => {
  try {
    await connectDB();
    
    // Format update data
    const formattedData = {
      ...updateData,
      stock: Math.floor(updateData.stock || 0),
      price: Number(updateData.price) || 0,
      productPrice: Number(updateData.productPrice) || 0,
      rating: Number(updateData.rating) || 0
    };

    const product = await Product.findByIdAndUpdate(id, formattedData, { 
      new: true,
      runValidators: true
    });
    if (!product) {
      return { error: 'Product not found' };
    }
    return serializeProduct(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return { error: error.message || 'Failed to update product' };
  }
};

export const deleteProduct = async (id) => {
  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return { error: 'Product not found' };
    }
    return { success: true, message: 'Product deleted successfully' };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { error: error.message || 'Failed to delete product' };
  }
};

export const getCategories = async () => {
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
    
    // Sort categories alphabetically
    validCategories.sort();
    
    return validCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { error: error.message || 'Failed to fetch categories' };
  }
};

export const getProductsByCategory = async (category) => {
  try {
    await connectDB();
    
    let query = {};
    if (category && category !== 'Uncategorized') {
      query.category = category;
    } else if (category === 'Uncategorized') {
      query = { 
        $or: [
          { category: null },
          { category: '' },
          { category: { $exists: false } }
        ] 
      };
    }
    
    const products = await Product.find(query).sort({ _id: -1 });
    
    return products.map(product => serializeProduct(product));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return { error: error.message || 'Failed to fetch products by category' };
  }
};
