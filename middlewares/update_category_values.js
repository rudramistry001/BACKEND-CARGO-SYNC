import Category from '../model/categories_model.js';
import Subcategory from '../model/sub_categories_model.js';  // Assuming you have a subcategory model

// Function to update categories' subcategories and totalSubcategories
const updateCategorySubcategories = async () => {
  try {
    // Find all subcategories
    const allSubcategories = await Subcategory.find();

    // Iterate through all subcategories
    for (let subcategory of allSubcategories) {
      // Check if the subcategory has a valid categoryId
      if (!subcategory.categoryId) {
        console.log(`Subcategory ${subcategory._id} does not have a categoryId.`);
        continue;
      }

      // Find the category associated with the subcategory using the categoryId
      const category = await Category.findById(subcategory.categoryId);

      if (!category) {
        console.log(`Category not found for subcategory ID: ${subcategory._id}`);
        continue;
      }

      // Add the subcategory to the category's subcategories if not already added
      if (!category.subcategories.includes(subcategory._id)) {
        category.subcategories.push(subcategory._id);
      }

      // Update totalSubcategories based on the current length of subcategories
      category.totalSubcategories = category.subcategories.length;

      // Update lastUpdated timestamp
      category.lastUpdated = new Date();

      // Save the updated category
      await category.save();
    }

    console.log('Categories updated successfully!');
  } catch (error) {
    console.error('Error updating categories:', error);
  }
};

export default updateCategorySubcategories;
