import rateLimit from "express-rate-limit";

// Create a rate limiter middleware
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again after 5 minutesz`.',
});

// Export the rate limiter so it can be used in other files
export default loginLimiter;
