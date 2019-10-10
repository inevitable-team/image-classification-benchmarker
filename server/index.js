const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const imagesApi = require('./routes/api/images');
const modelsApi = require('./routes/api/models');

app.use('/api/images', imagesApi);
app.use('/api/models', modelsApi);

// Static folder
app.use(express.static(__dirname + '/public/'));
app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
