const express = require('express');
const path = require('path');
const app = express();

// Serve main website from root
app.use(express.static(path.join(__dirname, 'main-website/build')));

// Serve Civilisation Compass from /civilisation
app.use('/civilisation', express.static(path.join(__dirname, 'civilisation-compass/dist')));

// Main website catch-all route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main-website/build', 'index.html'));
});

// Civilisation Compass catch-all route
app.get('/civilisation/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'civilisation-compass/dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));