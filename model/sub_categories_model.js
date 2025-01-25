import mongoose from 'mongoose';
import Category from './categories_model.js';

const attributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'array', 'date'],
    required: true,
  },
  required: {
    type: Boolean,
    default: true,
  },
});

const subcategorySchema = new mongoose.Schema(
  {
    CategoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
    attributes: [attributeSchema],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Middleware to update category when a subcategory is created
subcategorySchema.post('save', async function (doc) {
  try {
    const category = await Category.findById(doc.CategoryID);

    if (!category) {
      console.error(`Category not found for ID: ${doc.CategoryID}`);
      return;
    }

    // Avoid duplicate subcategory IDs in the category
    if (!category.subcategories.includes(doc._id)) {
      category.subcategories.push(doc._id);
    }

    // Update total count and timestamps
    category.totalSubcategories = category.subcategories.length;
    category.lastUpdated = new Date();
    category.updatedAt = new Date();

    await category.save();
    console.log(`Updated category ${doc.CategoryID} with subcategory ${doc._id}`);
  } catch (error) {
    console.error('Error in subcategory post-save middleware:', error);
  }
});

// Middleware to handle category updates on subcategory deletion
subcategorySchema.post('remove', async function (doc) {
  try {
    const category = await Category.findById(doc.CategoryID);

    if (!category) {
      console.error(`Category not found for ID: ${doc.CategoryID}`);
      return;
    }

    // Remove the subcategory ID from the category
    category.subcategories = category.subcategories.filter(
      (subcategoryId) => !subcategoryId.equals(doc._id)
    );

    // Update total count and timestamps
    category.totalSubcategories = category.subcategories.length;
    category.lastUpdated = new Date();
    category.updatedAt = new Date();

    await category.save();
    console.log(`Removed subcategory ${doc._id} from category ${doc.CategoryID}`);
  } catch (error) {
    console.error('Error in subcategory post-remove middleware:', error);
  }
});

// Static method to update category manually
subcategorySchema.statics.updateCategoryCount = async function (categoryId) {
  try {
    const category = await Category.findById(categoryId);

    if (category) {
      category.totalSubcategories = category.subcategories.length;
      category.lastUpdated = new Date();
      await category.save();
    }
  } catch (error) {
    console.error('Error updating category count:', error);
  }
};

export default mongoose.model('Subcategory', subcategorySchema);
