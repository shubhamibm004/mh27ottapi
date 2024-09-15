const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const pool = require('./db'); // MySQL connection pool
const { body, validationResult } = require('express-validator');


// Utility function to check environment variables
const checkEnvVars = (...vars) => {
  vars.forEach((env) => {
    if (!process.env[env]) {
      throw new Error(`Missing environment variable: ${env}`);
    }
  });
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT id, username, email, roles FROM users');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new user (Admin only)
exports.addUser = [
  body('username').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('roles').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, roles = 'User' } = req.body;
    try {
      checkEnvVars('JWT_SECRET', 'EMAIL', 'PASSWORD');

      // Check if user already exists
      const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user with roles
      await pool.execute('INSERT INTO users (username, email, password, roles, verified, is_admin) VALUES (?, ?, ?, ?, ?, ?)', [
        username, email, hashedPassword, roles, 0, roles === 'Admin' ? 1 : 0
      ]);

      res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
];

// Remove a user (Admin only)
exports.removeUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all movies (Admin only)
// Get all movies (Admin only)
exports.getAllMovies = async (req, res) => {
  try {
    const [movies] = await pool.execute('SELECT id, title, poster_path AS imageUrl, overview, release_date, language, popularity, vote_average FROM movies');
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new movie (Admin only)
exports.addMovie = async (req, res) => {
  const { title, imageUrl, overview } = req.body;
  try {
    await pool.execute('INSERT INTO movies (title, imageUrl, overview) VALUES (?, ?, ?)', [title, imageUrl, overview]);
    res.status(201).json({ message: 'Movie added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Add a new movie (Admin only)
exports.addMovie = async (req, res) => {
  const { title, poster_path, overview, release_date, language, popularity, vote_average } = req.body;
  try {
    await pool.execute('INSERT INTO movies (title, poster_path, overview, release_date, language, popularity, vote_average) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [title, poster_path, overview || '', release_date, language, popularity, vote_average]);
    res.status(201).json({ message: 'Movie added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Remove a movie (Admin only)
exports.removeMovie = async (req, res) => {
  const movieId = req.params.id;
  try {
    const [result] = await pool.execute('DELETE FROM movies WHERE id = ?', [movieId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json({ message: 'Movie removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


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
// Signup handler
exports.signup = [
  body('username').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('roles').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, roles = 'User' } = req.body;
    try {
      checkEnvVars('JWT_SECRET', 'EMAIL', 'PASSWORD');
      
      // Check if user already exists
      const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user with roles
      await pool.execute('INSERT INTO users (username, email, password, roles, verified, is_admin) VALUES (?, ?, ?, ?, ?, ?)', [
        username, email, hashedPassword, roles, 0, roles === 'Admin' ? 1 : 0
      ]);

      // Generate email verification token
      const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Send email verification
      const frontendVerificationLink = `http://localhost:3000/emailverified?token=${verificationToken}`;
      const verificationLink = `http://localhost:5000/api/verify-email?token=${verificationToken}`;
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Email Verification',
        html:  `Click <a href="${frontendVerificationLink}">here</a> to verify your email.`,
      });

      res.status(200).json({ message: 'User registered. Please verify your email.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
];
exports.getWishlist = async (req, res) => {
  try {
      const { user_id } = req.body;  // Get user_id from the request body
      if (!user_id) {
          return res.status(400).json({ message: 'User ID is required' });
      }
      const [rows] = await pool.execute('SELECT * FROM wishlist WHERE user_id = ?', [user_id]);
      return res.json(rows);
  } catch (error) {
      console.error(error);
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

// Email verification handler
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    await pool.execute('UPDATE users SET verified = 1 WHERE email = ?', [email]);
    const frontendVerificationLink = `http://localhost:3000/emailverified?token=${token}`;
    res.status(200).json({ message: 'Email verified successfully', redirect: frontendVerificationLink });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// Login handler
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
      { id: user[0].id, email: user[0].email, username: user[0].username, roles: user[0].roles, is_admin: user[0].is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, message: 'Login successful!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


