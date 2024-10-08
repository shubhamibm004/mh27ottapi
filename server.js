const express = require('express');
const cors = require('cors');
const authRoutes = require('./authRoutes');

const app = express();

app.use(cors());
app.use(express.json()); // Ensure this is called before routes

// Use the routes defined in authRoutes.js
app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
