const truckSchema = new mongoose.Schema({
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    licensePlate: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    capacityUnit: { type: String, enum: ['kg', 'lb', 'ton'], default: 'kg' },
    currentLoad: { type: Number, default: 0 },
    status: { type: String, enum: ['available', 'in_use', 'maintenance'], default: 'available' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  truckSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
  
  const Truck = mongoose.model('Truck', truckSchema);
  module.exports = Truck;
  