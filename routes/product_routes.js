import express from 'express';

import { authorize } from '../middlewares/authorize_middleware.js';
import { uploadProduct, getAllProducts } from '../controller/product_controller.js';

const router = express.Router();

// Route to upload a product (only accessible by 'admin')
router.post('/upload-product', authorize(['admin']), uploadProduct),

// Route to get all product (accessible by 'user' and 'admin')
router.get('/get-products', authorize(['user', 'admin']), getAllProducts);

export default router;
