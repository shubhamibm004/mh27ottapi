// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }
  
      if (!decoded.is_admin) {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      req.user = decoded;
      next();
    });
  };
  
  module.exports = isAdmin;