import jwt from 'jsonwebtoken';
import { User } from '../model/users/authModel.js';

// Authorization Middleware to check user roles
export const authorize = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Get the token from the Authorization header (Bearer Token)
      const token = req.header('Authorization').replace('Bearer ', '');
      console.log('Received Token:', token);  // Log the token for debugging

      // Decode the token using your JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log('Decoded Token:', decoded);  // Log the decoded token for debugging

      // Access the user ID from the decoded token
      const userId = decoded.id;  // Use `id` instead of `_id`
      console.log('User ID:', userId);  // Log the user ID

      // Find the user in the database using the decoded user ID
      const user = await User.findOne({ _id: userId });
      console.log('User:', user);  // Log the user data

      if (!user) {
        return res.status(401).json({ message: 'User not found!' });
      }

      // Check if the user's role is in the allowed roles
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }

      // Attach the user object to the request for use in the next middleware or handler
      req.user = user;

      // Proceed to the next middleware or route handler
      next();

    } catch (error) {
      console.error('Authorization Error:', error);  // Log any errors that occur
      return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
    }
  };
};
