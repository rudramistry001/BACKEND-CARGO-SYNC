import Product from '../model/product_schema.js';


// Controller for uploading a new product
export const uploadProduct = async (req, res) => {
  try {
    const { name, description, price, category, categoryType, specificFields, sku, stock, ratings, dimensions, tags } = req.body;

    // Prepare image URLs for storage (based on Multer settings)
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    // Create a new product
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      categoryType,
      specificFields,
      sku,
      stock,
      images: imageUrls,
      ratings: ratings ? JSON.parse(ratings) : [], // Ensure ratings are parsed if sent as string
      dimensions: dimensions ? JSON.parse(dimensions) : {}, // Convert dimensions to object if needed
      tags: tags ? tags.split(',') : [], // Convert comma-separated tags to an array
    });

    // Save the product to the database
    await newProduct.save();

    res.status(201).json({
      message: 'Product uploaded successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload product', error: error.message });
  }
};

// Controller for retrieving all products
export const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};
