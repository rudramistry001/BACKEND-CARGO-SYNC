import express from 'express';
import {
    updateProfile,
  
} from '../controller/profile_controller.js';
import { authorize } from '../middlewares/authorize_middleware.js';

const router = express.Router();

router.patch('/update-profile/:userId',  authorize(['user', 'admin']), updateProfile);
// router.post('/address/:userId', authorize(['user', 'admin']), addAddress);
// router.patch('/address/:userId/:addressId', authorize(['user', 'admin']), updateAddress);
// router.delete('/address/:userId/:addressId', authorize(['user', 'admin']), deleteAddress);
// router.patch('/wishlist/:userId', authorize(['user', 'admin']), updateWishlist);
// router.patch('/cart/:userId', authorize(['user', 'admin']), updateCart);

export default router;


//   addAddress,
// updateAddress,
// deleteAddress,
// updateWishlist,
// updateCart
