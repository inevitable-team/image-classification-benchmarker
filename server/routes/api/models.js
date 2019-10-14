const express = require('express');
const router = express.Router();
const models = require('../../models/index.js');
const datasets = require('../../imageDatasets/index.js');

router.get('/', async (req, res) => {
  res.status(200).json(models.map((model, i) => {
    return {
      id: i,
      name: model.name,
      desc: model.desc
    };
  }));
});

router.post('/train', async (req, res) => {
  try {
    let images = datasets[req.body.imageId], percentage = req.body.imagesToUse / images.data.images.length;
    let model = models[req.body.modelId].create(percentage, images.absUrl, req.body.knobs || {});
    let results = await model.run();
    res.status(200).json(results);
  } catch (e) {
    console.log("Training Error: ", e);
    res.status(400).send(e);
  }
});

module.exports = router;
