const express = require('express');
const router = express.Router();

// Get Posts
router.get('/', async (req, res) => {
  res.send("Okay!");
});

module.exports = router;
