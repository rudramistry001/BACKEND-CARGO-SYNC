
import {  login, logout, verifyToken, registerCustomer, registerDriver, registerAgency } from '../controller/authController.js';
import express from 'express';
import loginLimiter from "../middlewares/rate_limit_middleware.js";

// Create router object
const router = express.Router();

// Use the authenticateToken middleware for specific routes
router.post("/register-customer", registerCustomer);
router.post("/register-driver", registerDriver);
router.post("/register-agency", registerAgency);
router.post("/login",loginLimiter, login);
router.post("/logout", logout);
router.post("/", );
router.post("/verify-token", verifyToken)
export default router;