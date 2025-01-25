import express from 'express';
import { createCategory, getAllCategories} from '../controller/category_controller.js';
import { authorize } from '../middlewares/authorize_middleware.js';
import {syncCategoriesMiddleware} from '../middlewares/sync_categories.js';
const router = express.Router();

// Route to create and upload  a cateogory (only accessible by 'admin')
router.post('/create-category', authorize(['admin']), createCategory);

// Route to get  a cateogry  ( accessible by 'admin' & 'users')
router.get('/get-category', authorize(['admin','user']), getAllCategories);





export default router;
