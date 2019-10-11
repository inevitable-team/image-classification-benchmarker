const express = require('express');
const router = express.Router();
const datasets = require('../../imageDatasets/index.js');

router.get('/', async (req, res) => {
  res.status(200).json(datasets.map((d, i) => {
    return {
      id: i,
      name: d.name,
      count: d.data.images.length,
      classes: d.data.classes
    };
  }));
});

module.exports = router;
