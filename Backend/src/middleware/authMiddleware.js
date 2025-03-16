import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token provided or invalid format" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    
    delete decoded.iat;
    delete decoded.exp;

    next();
  } catch (error) {
    let message = 'Invalid token';
    if (error.name === 'TokenExpiredError') {
      message = 'Token expired';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Invalid token signature';
    }

    if (process.env.NODE_ENV !== 'production') {
      console.error('JWT Error:', error.message);
    }
    
    return res.status(401).json({ message });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: "Access denied: Administrator privileges required"
    });
  }
  
  next();
};