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