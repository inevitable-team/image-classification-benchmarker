const fs = require("fs"), sourceFolder = `${__dirname}/datasets`;

function getImages(sourceFolder) {
    if (fs.existsSync(sourceFolder)) {
        let data = { classes: [], images: [] };
        fs.readdirSync(sourceFolder).forEach((model, i) => {
            // Find Models
            data.classes.push(model);
            // Find Image Examples
            fs.readdirSync(`${sourceFolder}/${model}`)
            .filter(image => image.includes(".jpg") || image.includes(".jpeg") || image.includes(".png"))
            .forEach(image => data.images.push({ modelIndex: i, model: model, location: `${sourceFolder}/${model}/${image}` }));
        }); return data;
    } else {
        return null;
    }
}

module.exports = fs.readdirSync(sourceFolder).map(folderName => { 
    return { name: folderName, absUrl: `${sourceFolder}/${folderName}`, data: getImages(`${sourceFolder}/${folderName}`) }; 
});