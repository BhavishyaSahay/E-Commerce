require('dotenv').config();
const path = require('path');
const express = require('express');

const app = require('./app');

const PORT = process.env.PORT || 5004;

// ✅ Absolute path to frontend build
const distPath = path.join(__dirname, '../../client/dist');

// ✅ Serve static frontend files
app.use(express.static(distPath));

// ✅ React SPA fallback (MUST be last route)
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// ✅ Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});