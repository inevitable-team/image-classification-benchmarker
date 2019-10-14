const transferLearner = require("@inevitable/tfjs-transfer-learner");

class transferLearnerWrapper {
    constructor() {
        this.name = "TensorFlow MobileNet Transfer Learner";
        this.desc = "This algorithm uses the pre-trained MobileNet model as a feature extractor, in order to retrain it to learn new objects";
    }

    create(params) {
        this.transferLearner = transferLearner(params);
    }
}

module.exports = transferLearnerWrapper;