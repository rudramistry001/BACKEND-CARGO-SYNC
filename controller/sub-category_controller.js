import Subcategory from '../model/sub_categories_model.js';
import Category from '../model/categories_model.js';

export const createSubcategory = async (req, res) => {
  console.log('Starting createSubcategory with payload:', JSON.stringify(req.body, null, 2));

  try {
    const { categoryId, subcategories } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required',
      });
    }

    if (!subcategories || !Array.isArray(subcategories) || subcategories.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Subcategories must be a non-empty array',
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const savedSubcategories = [];
    const errors = [];

    for (const subcategory of subcategories) {
      try {
        if (!subcategory.name) {
          throw new Error('Subcategory name is required');
        }

        const existingSubcategory = await Subcategory.findOne({ name: subcategory.name });
        if (existingSubcategory) {
          throw new Error(`Subcategory with name "${subcategory.name}" already exists`);
        }

        const newSubcategory = new Subcategory({
          CategoryID: categoryId,
          name: subcategory.name,
          description: subcategory.description || '',
          attributes: subcategory.attributes || [],
        });

        const savedSubcategory = await newSubcategory.save();
        savedSubcategories.push(savedSubcategory);
      } catch (error) {
        errors.push(error.message);
      }
    }

    if (savedSubcategories.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No subcategories were created',
        errors,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Subcategories created successfully',
      data: savedSubcategories,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Unexpected error in createSubcategory:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
};


export const getAllSubcategoriesWithAttributes = async (req, res) => {
  console.log('Fetching all subcategories with attributes');
  
  try {
    await updateCategorySubcategories();
    
    const subcategories = await Subcategory.find()
      .select('name description attributes CategoryID')
      .populate('CategoryID', 'name');

    console.log(`Found ${subcategories.length} subcategories`);

    if (subcategories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No subcategories found'
      });
    }

    return res.status(200).json({
      success: true,
      data: { subcategories }
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching subcategories',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const getSubcategoriesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  console.log(`Fetching subcategories for category: ${categoryId}`);

  try {
    await updateCategorySubcategories();

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }

    const category = await Category.findById(categoryId)
      .populate({
        path: 'subcategories',
        select: 'name description attributes'
      });

    if (!category) {
      console.log(`Category not found with ID: ${categoryId}`);
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    console.log(`Found ${category.subcategories.length} subcategories for category ${category.name}`);

    return res.status(200).json({
      success: true,
      data: {
        categoryName: category.name,
        subcategories: category.subcategories
      }
    });
  } catch (error) {
    console.error(`Error fetching subcategories for category ${categoryId}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching subcategories',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};