require('dotenv').config();
const path = require('path');
const express = require('express');

const app = require('./app');

const PORT = 5001;

// ✅ Serve frontend build
const __dirnameResolved = path.resolve();

app.use(express.static(path.join(__dirnameResolved, '../client/dist')));

// ✅ Handle React routing (important for SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirnameResolved, '../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});