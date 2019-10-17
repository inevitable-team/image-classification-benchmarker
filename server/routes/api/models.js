const express = require('express');
const router = express.Router();
const models = require('../../models/index.js');
const datasets = require('../../imageDatasets/index.js');
const jpeg = require('jpeg-js');
let trainedModels = [];

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
    trainedModels.push({ uid: req.body.uid, mid: req.body.mid, model: model });
    res.status(200).json(results);
  } catch (e) {
    console.log("Training Error: ", e);
    res.status(400).send(e);
  }
});

router.post('/predictOne', async (req, res) => {
  try {
    console.log("Trained Models: ", trainedModels);
    let model = trainedModels.find(m => m.uid == req.body.uid && m.mid == req.body.mid).model;
    let bufferObj = req.body.Uint8ArrayBuffer;
    let imageBuffer = Buffer.from(Object.keys(bufferObj).map((k,i) => bufferObj[i]));
    let imageData = jpeg.decode(imageBuffer);
    console.log("Image Data: ", imageData);
    let prediction = await model.predictOne(imageData.data);
    res.status(200).json({ prediction });
  } catch (e) {
    console.log("Training Error: ", e);
    res.status(400).send(e);
  }
});

module.exports = router;
