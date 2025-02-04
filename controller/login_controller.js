import { User } from '../model/users/authModel.js';
import { generateAccessToken, generateRefreshToken } from '../config/jwt.js';
import Token from '../model/auth/token_model.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Use the userSchema's static method to handle login logic
    const user = await User.login(email, password);

    // If user found and password is correct, generate tokens
    const accessToken = generateAccessToken(user._id, user.role, user.fullname);
    const refreshToken = generateRefreshToken(user._id, user.role);

    // Delete any existing refresh token for this user
    await Token.deleteOne({ userId: user._id });

    // Store the new refresh token in the database
    await Token.create({ userId: user._id, refreshToken });

    // Send the response with the tokens
    res.status(200).json({
      user: {
        id: user.id,
        role: user.role,
        fullname: user.fullname,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    // Handle errors (incorrect email/password)
    res.status(400).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  const { refreshToken } = req.body;

  // Check if the refresh token is provided
  if (!refreshToken) {
    return res.status(401).json({ status: 'Error', error: 'Refresh Token is required.' });
  }

  try {
    // Optionally: Remove the refresh token from the database
    const deletedToken = await Token.deleteOne({ refreshToken });

    if (deletedToken.deletedCount === 0) {
      return res.status(403).json({ message: 'Refresh token not found or already invalidated.' });
    }

    // Send success response
    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'Error', error: 'An error occurred while logging out.' });
  }
};
