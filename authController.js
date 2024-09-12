const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db'); // MySQL connection pool


const nodemailer = require('nodemailer');

// Email verification setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Signup handler
exports.signup = async (req, res) => {
  const { username, email, password, roles = 'User' } = req.body;  // Default role as 'User'
  try {
    // Check if user already exists
    const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user with roles
    await pool.execute('INSERT INTO users (username, email, password, roles, verified) VALUES (?, ?, ?, ?, ?)', [
      username, email, hashedPassword, roles, 1,
    ]);

    // Generate email verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send email verification
    const verificationLink = `http://localhost:5000/api/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Email Verification',
      html: `Click <a href="${verificationLink}">here</a> to verify your email.`,
    });

    res.status(200).json({ message: 'User registered. Please verify your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Email verification handler
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    await pool.execute('UPDATE users SET verified = 1 WHERE email = ?', [email]);
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// Login handler
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (user.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user[0].verified) {
      return res.status(400).json({ message: 'Please verify your email before logging in' });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user[0].id, email: user[0].email, username: user[0].username, roles: user[0].roles },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, message: 'Login successful!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Wishlist handlers
// GET - Retrieve all wishlist items for a user
exports.getWishlist = async (req, res) => {
  try {
    const user_id = req.body.user_id; // Assuming user_id is passed in the request body
    const [rows] = await pool.execute('SELECT * FROM wishlist WHERE user_id = ?', [user_id]);
    return res.send(rows);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      location: 'authController.js',
      method: 'getWishlist',
    });
  }
};

// POST - Add a movie to the wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { user_id, id, imageUrl, title, overview } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO wishlist (user_id, id, imageUrl, title, overview) VALUES (?, ?, ?, ?, ?)',
      [user_id, id, imageUrl, title, overview]
    );
    return res.send({ id: result.insertId, user_id, imageUrl, title, overview });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      location: 'authController.js',
      method: 'addToWishlist',
    });
  }
};

// DELETE - Remove a movie from the wishlist by ID
exports.deleteFromWishlist = async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await pool.execute('DELETE FROM wishlist WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Item not found' });
    }
    return res.send({ message: 'Item deleted successfully' });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
