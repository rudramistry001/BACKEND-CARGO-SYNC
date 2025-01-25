// middlewares/sync_categories.js
import Category from '../model/categories_model.js';
import Subcategory from '../model/sub_categories_model.js';

/**
 * Middleware to sync categories with their subcategories
 * This ensures that category.subcategories array matches actual subcategories in the collection
 * and updates totalSubcategories count accordingly
 */
export const syncCategories = async () => {
  console.log('Starting category sync process...');
  
  try {
    // Get all categories
    const categories = await Category.find();
    console.log(`Found ${categories.length} categories to sync`);

    // Process each category
    const syncPromises = categories.map(async (category) => {
      try {
        // Find all subcategories that reference this category
        const actualSubcategories = await Subcategory.find({ CategoryID: category._id });
        const actualSubcategoryIds = actualSubcategories.map(sub => sub._id);
        
        // Check if arrays are different (need updating)
        const currentIds = category.subcategories.map(id => id.toString()).sort();
        const newIds = actualSubcategoryIds.map(id => id.toString()).sort();
        const needsUpdate = JSON.stringify(currentIds) !== JSON.stringify(newIds);
        
        if (needsUpdate) {
          console.log(`Updating category ${category.name} (${category._id})`);
          console.log(`- Current subcategories: ${category.subcategories.length}`);
          console.log(`- Actual categories: ${actualSubcategoryIds.length}`);
          
          // Update category with correct subcategory IDs and count
          const updateResult = await Category.findByIdAndUpdate(
            category._id,
            {
              $set: {
                subcategories: actualSubcategoryIds,
                totalSubcategories: actualSubcategoryIds.length,
                lastUpdated: new Date(),
                updatedAt: new Date()
              }
            },
            { new: true }
          );
          
          console.log(`✓ Successfully updated category ${category.name}`);
          return {
            categoryId: category._id,
            name: category.name,
            previousCount: category.totalSubcategories,
            newCount: updateResult.totalSubcategories,
            updated: true
          };
        }
        
        return {
          categoryId: category._id,
          name: category.name,
          count: category.totalSubcategories,
          updated: false
        };
        
      } catch (error) {
        console.error(`Error syncing category ${category._id}:`, error);
        return {
          categoryId: category._id,
          name: category.name,
          error: error.message
        };
      }
    });

    // Wait for all sync operations to complete
    const results = await Promise.all(syncPromises);
    
    // Log summary
    const updatedCategories = results.filter(r => r.updated);
    const failedCategories = results.filter(r => r.error);
    
    console.log('\nSync Summary:');
    console.log(`- Total categories processed: ${results.length}`);
    console.log(`- Categories updated: ${updatedCategories.length}`);
    console.log(`- Categories failed: ${failedCategories.length}`);
    
    if (failedCategories.length > 0) {
      console.log('\nFailed categories:', failedCategories);
    }
    
    return {
      success: true,
      totalProcessed: results.length,
      updated: updatedCategories.length,
      failed: failedCategories.length,
      results
    };
    
  } catch (error) {
    console.error('Error in syncCategories middleware:', error);
    throw error;
  }
};

// Helper function to run sync as Express middleware
export const syncCategoriesMiddleware = async (req, res, next) => {
  try {
    await syncCategories();
    next();
  } catch (error) {
    console.error('Error in syncCategories middleware:', error);
    next(error);
  }
};

export default syncCategories;