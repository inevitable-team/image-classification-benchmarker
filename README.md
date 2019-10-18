# Image Classification Benchmarker

This is an open source benchmarking tool for Machine Learning practitioners, the purpose of which is to accurately compare multiple Machine Learning algorithms and techniques against one another, under a standardised condition.

![Screenshot](https://i.imgur.com/1YqqU7K.jpg)

## Setup

Some implemented algorithms use TensorFlow.js, which require you to install the [`windows-build-tools`](https://www.npmjs.com/package/windows-build-tools) for the TFJS binaries to build from Python.

Once downloaded, run `npm i` to install the dependencies, execute `npm start` to start the server and then visit `http://localhost:5000/`.

### Using Different Algorithms

You will find the controller for loading the various algorithms in `~/server/models/index.js`, this will then load all of the JavaScript files in the `~/server/models/wrappers` directory.

These wrappers are exported classes that require a name, description with a create function. The `create` function will be used to return a new instance of a model, which will be ran per each API call, which will return the results.

Also, along with a `run` function in the instance, a `predictOne` function is also needed, which takes a file buffer as in input to return a prediction of the class.

An example of which would be:

```js
const fs = require("fs");

class exampleWrapper {
    constructor() {
        this.name = "Algorithm #1";
        this.desc = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam vel labore quos sit minus corrupti voluptatibus.";
    }

    create(imagePercentage, imageAbsPath, params) {
        params.classCount = fs.readdirSync(imageAbsPath).length;
        return new e(params);
    }
}

class e {
    constructor(params) {
        this.params = params;
    }

    async predictOne(fileBuffer) {
        return "N/A";
    }

    async run() {
        return {
            setUpTime: 0,
            trainTime: 0,
            evaluateTime: 0,
            confusionMatrix: Array.from({ length: this.params.classCount }).map(() => Array.from({ length: this.params.classCount }).fill(0)),
            accuracy: 0
        };
    }
}

module.exports = exampleWrapper;
```

### Using Image Datasets

The directory the image datasets should be placed in is `~/server/imageDatasets/datasets/`, which then should have the following folder structure:

```
datasets
+-- cifar10
|   +-- airplane
|   |   +-- image_x.jpeg
|   |   +-- image_z.png
|   |   +-- image_l.png
|   +-- automobile
|   |   +-- image_q.png
|   |   +-- image_a.jpg
|   |   +-- image_d.jpeg
+-- MNIST
|   +-- 0
|   |   +-- image_er.png
|   |   +-- image_do.jpg
|   |   +-- image_b.jpg
|   +-- 1
|   |   +-- ima_0.jpeg
|   |   +-- imatg.jpg
```

You can find the following images datasets by clicking the following links:
cifar10 - [https://pjreddie.com/projects/cifar-10-dataset-mirror/](https://pjreddie.com/projects/cifar-10-dataset-mirror/)
MNIST - [https://www.kaggle.com/scolianni/mnistasjpg/download](https://www.kaggle.com/scolianni/mnistasjpg/download)

### Using `@tensorflow/tfjs-node-gpu`

In the various model wrappers there are lines of code to use the gpu version of tfjs, these might require further debugging to install on a local machine, but will increase performance once `npm i @tensorflow/tfjs-node-gpu` is ran successfully on a machine.

If you get the following error:

```
internal/modules/cjs/loader.js:805
  return process.dlopen(module, path.toNamespacedPath(filename));
```

Try rebuilding the package from source (`npm rebuild @tensorflow/tfjs-node-gpu --build-from-source`).

## Roadmap

Below is our current plan for this project:

![Roadmap](https://i.imgur.com/MCYvNhx.jpg)