
import {  login, logout, verifyToken, registerCustomer, registerDriver, registerAgency } from '../controller/authController.js';
import express from 'express';
import loginLimiter from "../middlewares/rate_limit_middleware.js";

// Create router object
const router = express.Router();

// Use the authenticateToken middleware for specific routes
router.post("/register-customer",authorize(['customer', 'admin']), registerCustomer);
router.post("/register-driver",['driver', 'admin'], registerDriver);
router.post("/register-agency",['agency', 'admin'], registerAgency);
router.post("/login",loginLimiter,['customer', 'admin','driver','agency',], login);
router.post("/logout", logout);
router.post("/", );
router.post("/verify-token", verifyToken)
export default router;