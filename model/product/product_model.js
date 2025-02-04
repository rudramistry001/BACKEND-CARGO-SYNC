import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dimensions: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    unit: { type: String, enum: ['cm', 'm', 'in', 'ft'], default: 'cm' }
  },
  category: { type: String, required: true },
  weight: { type: Number, required: true },
  weightUnit: { type: String, enum: ['kg', 'g', 'lb', 'oz'], default: 'kg' },
  fragile: { type: Boolean, default: false },
  description: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'in_transit', 'delivered'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
