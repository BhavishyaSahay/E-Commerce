require('dotenv').config();
const path = require('path');
const express = require('express');

const app = require('./app');

const PORT = process.env.PORT || 5004;

// Static files are now handled by Nginx in the frontend container

// ✅ Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});