import Category from '../model/categories_model.js';
import updateCategorySubcategories from '../middlewares/update_category_values.js'


// Controller to create a new category
export const createCategory = async (req, res) => {
  const { name, description } = req.body;

  // Check if category already exists
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return res.status(400).json({ message: 'Category already exists' });
  }

  try {
    // Create a new category instance
    const newCategory = new Category({
      name,
      description,
      subcategories: [],  // Initially, no subcategories
    });

    // Save the category to the database (totalSubcategories will be 0)
    await newCategory.save();

    res.status(201).json({ message: 'Category created successfully', newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating category', error });
  }
};



// Controller to get all categories
export const getAllCategories = async (req, res) => {
  try {
    updateCategorySubcategories();
    // Retrieve all categories from the database
    const categories = await Category.find().populate('subcategories'); // Optionally populate subcategories if needed

    if (categories.length === 0) {
      return res.status(404).json({ message: 'No categories found' });
    }

    res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};


