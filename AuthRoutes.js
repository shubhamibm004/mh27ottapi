const express = require('express');
const router = express.Router();
const authController = require('./authController');
//const wishlistController = require('./wishlist.controller');
const axios = require('axios');
const { authenticateAdmin } = require('./authMiddleware'); // Middleware to check if user is an admin

// Define your API key here
const API_KEY = '3e3f0a46d6f2abc8e557d06b3fc21a77';

// Authentication routes
router.post('/signup', authController.signup);
router.get('/verify-email', authController.verifyEmail);
router.post('/login', authController.login);

// Admin routes
router.get('/admin/dashboard', authenticateAdmin, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard!' });
});

// Admin management routes
router.get('/admin/users', authenticateAdmin, authController.getAllUsers);
router.post('/admin/add-user', authenticateAdmin, authController.addUser);
router.delete('/admin/remove-user/:id', authenticateAdmin, authController.removeUser);
router.get('/admin/movies', authenticateAdmin, authController.getAllMovies);
router.post('/admin/add-movie', authenticateAdmin, authController.addMovie);
router.delete('/admin/remove-movie/:id', authenticateAdmin, authController.removeMovie);

// Wishlist routes
router.get('/watchlist', authenticateAdmin, authController.getWishlist); // Fetch wishlist
router.post('/watchlist', authenticateAdmin, authController.addToWishlist); // Add to wishlist
router.delete('/watchlist/:id', authenticateAdmin, authController.deleteFromWishlist); // Remove from wishlist by ID

// Movie routes
router.get('/movies', async (req, res) => {
    try {
        const language = req.query.language || 'en-US';
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=${language}&language=${language}&sort_by=original_title.asc&year=2022&page=1`;
        const response = await axios.get(url);
        return res.json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            location: 'authroutes.js',
            method: 'get /movies',
        });
    }
});

// TV routes
router.get('/tv', async (req, res) => {
    try {
        const language = req.query.language || 'en-US';
        const url = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&with_original_language=${language}&language=${language}&page=1`;
        const response = await axios.get(url);
        return res.json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            location: 'authroutes.js',
            method: 'get /tv',
        });
    }
});

// Search routes
router.get('/search', async (req, res) => {
    try {
        const q = req.query.q;
        const language = req.query.language || 'en-US';
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=${language}&query=${q}&page=1&include_adult=false`;
        const response = await axios.get(url);
        return res.json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            location: 'authroutes.js',
            method: 'get /search',
        });
    }
});

module.exports = router;
