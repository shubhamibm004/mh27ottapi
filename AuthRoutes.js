const express = require('express');
const router = express.Router();
const authController = require('./authController');
const axios = require('axios');

// Define your API key here
const API_KEY = '3e3f0a46d6f2abc8e557d06b3fc21a77';

// Authentication routes
router.post('/signup', authController.signup);
router.get('/verify-email', authController.verifyEmail);
router.post('/login', authController.login);

// Wishlist routes
router.get('/watchlist', authController.getWishlist);        // Fetch wishlist
router.post('/watchlist', authController.addToWishlist);     // Add to wishlist
router.delete('/watchlist/:id', authController.deleteFromWishlist); // Remove from wishlist by ID

// Movie routes
router.get('/movies', async (req, res) => {
    try {
        const language = req.query.language || 'en-US';
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=${language}&language=${language}&sort_by=original_title.asc&year=2022&page=1`;
        const response = await axios.get(url);
        return res.send(response.data);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
            location: 'movie.controller',
        });
    }
});

// TV routes
router.get('/tv', async (req, res) => {
    try {
        const language = req.query.language || 'en-US';
        const url = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&with_original_language=${language}&language=${language}&page=1`;
        const response = await axios.get(url);
        return res.send(response.data);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
            location: 'movie.controller',
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
        return res.send(response.data);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
            location: 'movie.controller',
        });
    }
});

module.exports = router;
