const express = require('express');
const router = express.Router();
const models = require('../../models/index.js');
const datasets = require('../../imageDatasets/index.js');
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
    // If model has been previously trained, remove it
    let modelIndex = trainedModels.findIndex(m => m.uid == req.body.uid && m.mid == req.body.mid);
    if (modelIndex != -1) trainedModels.splice(modelIndex, 1);
    // Getting needed resources
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
    let model = trainedModels.find(m => m.uid == req.body.uid && m.mid == req.body.mid).model;
    let bufferObj = req.body.Uint8ArrayBuffer;
    let imageBuffer = Buffer.from(Object.keys(bufferObj).map((k,i) => bufferObj[i]));
    let prediction = await model.predictOne(imageBuffer, {});
    res.status(200).json({ prediction });
  } catch (e) {
    console.log("Training Error: ", e);
    res.status(400).send(e);
  }
});

module.exports = router;
