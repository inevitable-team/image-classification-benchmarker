const transferLearner = require("@inevitable/tfjs-transfer-learner");

class transferLearnerWrapper {
    constructor() {
        this.name = "TensorFlow MobileNet Transfer Learner";
        this.desc = "This algorithm uses the pre-trained MobileNet model as a feature extractor, in order to retrain it to learn new objects";
    }

    create(imagePercentage, imageAbsPath, params) {
        params.imagesUrl = imageAbsPath;
        params.imageLimiter = imagePercentage;
        return new tl(params);
    }
}

class tl {
    constructor(params) {
        this.transferLearner = new transferLearner(params);
    }

    async run() {
        await this.transferLearner.setup();
        await this.transferLearner.train();
        await this.transferLearner.evaluate();
        let results = this.transferLearner.benchmarkResults();
        this.transferLearner = null;
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