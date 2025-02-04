import express from 'express';
import loginLimiter from "../middlewares/rate_limit_middleware.js";
import { authorize } from "../middlewares/authorize_middleware.js";

import { registerCustomer, registerDriver, registerAgency } from '../controller/register_controller.js';
import { login, logout } from '../controller/login_controller.js';
import { verifyToken } from '../controller/token-verify_controller.js';

// Create router object
const router = express.Router();

// Use the authenticateToken middleware for specific routes
router.post("/register-customer", registerCustomer);
router.post("/register-driver", registerDriver);
router.post("/register-agency", registerAgency);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.post("/verify-token", verifyToken);

export default router;
