"use server";
import { connectDB } from "../lib/db";
import Product from "../models/product";

// Helper function to serialize product data
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
  
  console.log("Serialized product:", serialized);
  return serialized;
};

// Get all products
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

// Get product by ID
export const getProductById = async (id) => {
  try {
    await connectDB();
    const product = await Product.findById(id);
    if (!product) {
      return { error: 'Product not found' };
    }
    console.log("Raw product from DB:", {
      specifications: product.specifications,
      stock: product.stock
    });
    return serializeProduct(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return { error: error.message || 'Failed to fetch product' };
  }
};

// Create new product
export const createProduct = async (productData) => {
  try {
    await connectDB();
    
    console.log("Creating product with data:", {
      specifications: productData.specifications,
      stock: productData.stock
    });
    
    // Format the data
    const formattedData = {
      ...productData,
      specifications: productData.specifications || '',
      stock: Math.max(0, parseInt(productData.stock) || 0),
      price: Number(productData.price) || 0,
      productPrice: Number(productData.productPrice) || 0
    };
    
    console.log("Formatted data for create:", {
      specifications: formattedData.specifications,
      stock: formattedData.stock
    });

    const product = await Product.create(formattedData);
    console.log("Product created:", {
      specifications: product.specifications,
      stock: product.stock
    });
    return serializeProduct(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return { error: error.message || 'Failed to create product' };
  }
};

// Update product
export const updateProduct = async (id, productData) => {
  try {
    await connectDB();
    
    console.log("Updating product with data:", {
      specifications: productData.specifications,
      stock: productData.stock
    });
    
    // Format the data
    const formattedData = {
      ...productData,
      specifications: productData.specifications || '',
      stock: Math.max(0, parseInt(productData.stock) || 0),
      price: Number(productData.price) || 0,
      productPrice: Number(productData.productPrice) || 0
    };
    
    console.log("Formatted data for update:", {
      specifications: formattedData.specifications,
      stock: formattedData.stock
    });

    const product = await Product.findByIdAndUpdate(
      id,
      formattedData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return { error: 'Product not found' };
    }
    
    console.log("Product updated:", {
      specifications: product.specifications,
      stock: product.stock
    });
    
    return serializeProduct(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return { error: error.message || 'Failed to update product' };
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return { error: 'Product not found' };
    }
    return { message: 'Product deleted successfully' };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { error: error.message || 'Failed to delete product' };
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    await connectDB();
    const products = await Product.find({ category }).sort({ _id: -1 });
    return products.map(product => serializeProduct(product));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return { error: error.message || 'Failed to fetch products by category' };
  }
}; 