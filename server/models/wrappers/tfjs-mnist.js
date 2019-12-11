const mnist = require("@inevitable/tfjs-mnist"); //, tf_gpu = require("@tensorflow/tfjs-node-gpu");

class tfjsMnistWrapper {
    constructor() {
        this.name = "TensorFlow.js Example: Training MNIST";
        this.desc = "This is the re-implementation of TensorFlow example implementation using a feed forwards neural network.";
    }

    create(imagePercentage, imageAbsPath, params) {
        params.imagesUrl = imageAbsPath;
        params.imageLimiter = imagePercentage;
        // params.tf = tf_gpu;
        return new tfjsMnist(params);
    }
}

class tfjsMnist {

    constructor(params) {
        this.mnist = new mnist(params);
    }

    async predictOne(fileBuffer) {
        return await this.mnist.predictOne(fileBuffer);
    }

    async run() {
        return await this.mnist.run();
    }
}

module.exports = tfjsMnistWrapper;