import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  categoryType: { type: String, required: true }, // To identify product category
  specificFields: mongoose.Schema.Types.Mixed,   // For category-specific fields
  sku: { type: String, unique: true }, // Stock Keeping Unit
  stock: { type: Number, default: 0 },
  images: [String], // Array of URLs to product images
  ratings: {
    type: [{ rating: Number, comment: String, user: mongoose.Schema.Types.ObjectId }],
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['available', 'out of stock', 'discontinued'], default: 'available' },
  dimensions: {
    weight: Number,
    height: Number,
    width: Number,
    depth: Number,
  },
  tags: [String], // Array of tags for product searchability
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
