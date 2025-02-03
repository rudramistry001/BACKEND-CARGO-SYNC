import { login, logout, verifyToken, registerCustomer, registerDriver, registerAgency } from '../controller/authController.js';
import express from 'express';
import loginLimiter from "../middlewares/rate_limit_middleware.js";
import { authorize} from "../middlewares/authorize_middleware.js";

// Create router object
const router = express.Router();

// Use the authenticateToken middleware for specific routes
router.post("/register-customer", registerCustomer);
router.post("/register-driver", authorize(['driver', 'admin']), registerDriver);
router.post("/register-agency",  authorize(['agency', 'admin']), registerAgency);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.post("/verify-token", verifyToken);

export default router;