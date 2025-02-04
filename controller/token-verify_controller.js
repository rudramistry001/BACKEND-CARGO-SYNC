import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res) => {
  const accessToken = req.body.accessToken ||
                      req.query.accessToken ||
                      req.headers['x-access-token'];

  // Check if token is provided
  if (!accessToken) {
    return res.status(403).json({
      status: 'Error',
      error: 'No access token provided'
    });
  }

  try {
    // Log the secret key to ensure it's correctly set
    console.log('ACCESS_TOKEN_SECRET:', process.env.JWT_SECRET_KEY);

    // Verify the token using the access token secret
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY // Ensure this matches your token generation secret
    );

    // If token is valid, return the decoded information
    res.status(200).json({
      status: 'Success',
      user: {
        id: decoded.id,
        role: decoded.role,
        fullname: decoded.fullname
      },
      tokenValid: true
    });

  } catch (error) {
    // Comprehensive error logging
    console.error('Token Verification Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    // Detailed error handling
    switch (error.name) {
      case 'TokenExpiredError':
        return res.status(401).json({
          status: 'Error',
          error: 'Access token has expired',
          details: error.message,
          tokenValid: false
        });

      case 'JsonWebTokenError':
        return res.status(401).json({
          status: 'Error',
          error: 'Invalid access token',
          details: error.message,
          tokenValid: false
        });

      case 'NotBeforeError':
        return res.status(401).json({
          status: 'Error',
          error: 'Token not yet active',
          details: error.message,
          tokenValid: false
        });

      default:
        // Log the full error for debugging
        console.error('Unexpected verification error:', error);

        res.status(500).json({
          status: 'Error',
          error: 'Token verification failed',
          details: error.message,
          tokenValid: false
        });
    }
  }
};
