import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  subcategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',  // Reference to the Subcategory model
    },
  ],
  totalSubcategories: {
    type: Number,
    default: 0,  // Default value is 0 until it's updated
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update totalSubcategories before saving
categorySchema.pre('save', function (next) {
  // Update the totalSubcategories based on the length of the subcategories array
  this.totalSubcategories = this.subcategories.length;
  this.lastUpdated = new Date(); // Update lastUpdated timestamp
  next();
});

// Middleware to update totalSubcategories when subcategories are added or removed
categorySchema.pre('findOneAndUpdate', async function (next) {
  const updatedDoc = await this.model.findOne(this.getQuery());
  const update = this.getUpdate();

  if (update.subcategories) {
    updatedDoc.subcategories = update.subcategories;
  }

  updatedDoc.totalSubcategories = updatedDoc.subcategories.length;
  updatedDoc.lastUpdated = new Date(); // Update lastUpdated timestamp
  this.setUpdate(updatedDoc);
  next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
