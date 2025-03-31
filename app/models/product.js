import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  specifications: {
    type: String,
    default: '',
    trim: false // Don't trim specifications to preserve formatting
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  productPrice: {
    type: Number,
    min: 0,
    default: 0
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
    get: v => Math.floor(v || 0),
    set: v => Math.floor(v || 0)
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
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
  }]
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

// Prevent model recompilation in development
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product; 