const fs = require("fs");

function getModels(sourceFolder) {
    if (fs.existsSync(sourceFolder)) { // Ensuring there is a wrappers folder for each algorithms implementation
        return fs.readdirSync(sourceFolder).filter(file => file.includes(".js") && !file.includes("example.js")).map(model => new (require(`${sourceFolder}/${model}`))());
    } else { return null; }
}

module.exports = getModels(`${__dirname}/wrappers`);