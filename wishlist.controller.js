const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise'); // Use mysql2 for async/await support

// Create a MySQL connection pool (replace with your actual DB config)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'your_database',
});

// GET - Retrieve all wishlist items for a user
router.get('/', async (req, res) => {
    try {
        const user_id = req.body.user_id; // Assuming user_id is passed in the request body
        const [rows] = await pool.execute('SELECT * FROM wishlist WHERE user_id = ?', [user_id]);
        return res.send(rows);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
            location: 'wishlist.controller.js',
            method: 'get',
        });
    }
});

// POST - Add a movie to the wishlist
router.post('/', async (req, res) => {
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
            location: 'wishlist.controller.js',
            method: 'post',
        });
    }
});

// DELETE - Remove a movie from the wishlist by ID
router.delete('/:id', async (req, res) => {
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
});

module.exports = router;
