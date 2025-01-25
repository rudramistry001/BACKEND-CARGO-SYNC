import express from 'express';
import { uploadOffer, getUploadOffer } from '../controller/offer_controller.js';  
import { authorize } from '../middlewares/authorize_middleware.js';
import { upload, convertToBase64 } from '../config/multer_config.js'; 

const router = express.Router();

// Route to upload an offer (only accessible by 'admin')
router.post('/uploadOffer', authorize(['admin']), upload.single('image'), convertToBase64, uploadOffer);

// Route to get all offers (accessible by 'user' and 'admin')
router.get('/getUploadsOffer', authorize(['user', 'admin']), getUploadOffer);



export default router;
