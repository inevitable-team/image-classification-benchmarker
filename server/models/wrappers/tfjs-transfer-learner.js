const transferLearner = require("@inevitable/tfjs-transfer-learner");
const tfn = require("@tensorflow/tfjs-node");
// const tf_gpu = require("@tensorflow/tfjs-node-gpu");

class transferLearnerWrapper {
    constructor() {
        this.name = "TensorFlow MobileNet Transfer Learner";
        this.desc = "This algorithm uses the pre-trained MobileNet model as a feature extractor, in order to retrain it to learn new objects";
    }

    create(imagePercentage, imageAbsPath, params) {
        params.imagesUrl = imageAbsPath;
        params.imageLimiter = imagePercentage;
        params.oldModelUrl = tfn.io.fileSystem("./server/models/assets/mobilenet_v1_0.25_224/model.json");
        // params.tf = tf_gpu;
        return new tl(params);
    }
}

class tl {
    constructor(params) {
        this.transferLearner = new transferLearner(params);
    }

    async predictOne(fileBuffer) {
        return await this.transferLearner.predictOneFromFileBuffer(fileBuffer);
    }

    async run() {
        await this.transferLearner.setup();
        await this.transferLearner.train();
        await this.transferLearner.evaluate();
        let results = this.transferLearner.benchmarkResults();
        return {
            setUpTime: results.setUpTime,
            trainTime: results.trainTime,
            evaluateTime: results.evaluateTime,
            confusionMatrix: results.confusionMatrix,
            accuracy: results.accuracy
        };
    }
}

module.exports = transferLearnerWrapper;