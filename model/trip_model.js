import mongoose from 'mongoose';


const tripSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    truckId: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck', required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pickupOTP: { type: String },
    dropOTP: { type: String },
    pickupTime: { type: Date },
    dropTime: { type: Date },
    status: { type: String, enum: ['pending', 'in_transit', 'delivered'], default: 'pending' },
    liveLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  tripSchema.index({ liveLocation: '2dsphere' });
  
  tripSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
  
  const Trip = mongoose.model('Trip', tripSchema);
  module.exports = Trip;
  