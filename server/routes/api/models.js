const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  // PLACEHOLDER
  res.status(200).json([{
        id: 1,
        name: "TensorFlow Transfer Learner",
        desc: "Example text."
    }, {
        id: 2,
        name: "BrainJS CNN",
        desc: "Example text two."
    }]);
});

router.post('/train', async (req, res) => {
  res.send("Okay!");
});

module.exports = router;
