import express from 'express';
import { authorize } from '../middlewares/authorize_middleware.js';
import { createSubcategory,getAllSubcategoriesWithAttributes,getSubcategoriesByCategory } from '../controller/sub-category_controller.js';

const router = express.Router();

// Route to create and upload  a  sub category  (only accessible by 'admin')
router.post('/create-sub-category', authorize(['admin']), createSubcategory);



// // Route to get  a cateogry  ( accessible by 'admin' & 'users')
// router.get('/get-all-subcategory', authorize(['admin','user']), getAllCategories);


// Route to get  a  sub cateogry with attributes  ( accessible by 'admin' & 'users')
router.get('/get-all-subcategory-with-attribute', authorize(['admin','user']), getAllSubcategoriesWithAttributes);


// Route to get  a cateogry  ( accessible by 'admin' & 'users')
router.get('/get-all-subcategory-by-category', authorize(['admin','user']), getSubcategoriesByCategory);



export default router;
