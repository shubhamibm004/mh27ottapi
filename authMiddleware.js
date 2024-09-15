const jwt = require('jsonwebtoken');
const pool = require('./db'); // MySQL connection pool

exports.authenticateAdmin = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user is an admin
    const [user] = await pool.execute('SELECT is_admin FROM users WHERE id = ?', [decoded.id]);
    if (user.length === 0 || !user[0].is_admin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    req.user = decoded; // Add user info to request object
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Invalid token' });
  }
};
