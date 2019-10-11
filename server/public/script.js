let IMAGES, MODELS, rangeElement, datasetsElement, modelsInUse = [], imagesToUse = 0, idCount = 0;

window.addEventListener("load", () => {
    // getReq("https://jsonplaceholder.typicode.com/todos/1", console.log, (res) => console.log("Fu", res));
    getReq("/api/images", setImages, setImagesPlaceholder);
    getReq("/api/models", setModels, setModelsPlaceholder);
    rangeElement = document.getElementById("imageCount");
    rangeElement.addEventListener("input", imageCountScroll);
    datasetsElement = document.getElementById("datasets");
    datasetsElement.addEventListener("change", () => imageChange(datasetsElement.selectedIndex));
    document.getElementById("addAlgorithm").addEventListener("click", addAlgorithmEventListener);
});

function addAlgorithmEventListener() {
    let selectedId = document.getElementById("algorithmsList").selectedIndex;
    modelsInUse.push({ id: idCount++, modelId: MODELS[selectedId].id, trained: false });
    setModelsHTML();
}

function getReq(url, okayHandler, errorHandler) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.onload = () => xhr.status == 200 ? okayHandler(xhr.response) : errorHandler(xhr);
    xhr.onerror = errorHandler;
}

function postReq(url, json, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(json));
    xhr.onreadystatechange = () => (xhr.readyState == 4 && xhr.status == 200) ? callback(xhr.responseText) : null;
}

function initImages() {
    document.getElementById("datasets").innerHTML = IMAGES.map(set => `<option value="${set.name}">${set.name}</option>`);
    imageChange(0);
}

function imageChange(index) {
    document.getElementById("datasetText").innerHTML = `${IMAGES[index].desc} <br/><br/> Classes: ['${IMAGES[index].classes.join("', '")}']`;
    rangeElement.min = IMAGES[index].classes.length * 10;
    rangeElement.max = IMAGES[index].count;
    rangeElement.value = IMAGES[index].count;
    rangeElement.step = IMAGES[index].classes.length;
    imageCountScroll();
}

function imageCountScroll() {
    imagesToUse = rangeElement.value;
    document.getElementById("imageCountText").innerHTML = `Use ${rangeElement.value} images out of ${rangeElement.max}.`;
}

function initModels() {
    document.getElementById("algorithmsList").innerHTML = MODELS.map((m, i) => `<option id="m${i}">${m.name}</option>`);
    modelsInUse = MODELS.map(m => {
        return {
            id: idCount++,
            modelId: m.id,
            trained: false
        };
    });
    setModelsHTML();
}

function setModelsHTML() {
    document.getElementById("algorithms").innerHTML = modelsInUse.map(m => m.trained ? trainedModelHTML(m) : trainModelHTML(m)).join("");
    setupModelEventListeners(modelsInUse);
}

function setupModelEventListeners(modelArr) {
    modelArr.forEach(el => {
        let i = modelsInUse.findIndex(el2 => el2.id == el.id);
        document.getElementById(`a${el.id}delBtn`).addEventListener("click", () => {
            modelsInUse.splice(i, 1);
            setModelsHTML();
        });
        document.getElementById(`a${el.id}trainBtn`).addEventListener("click", () => {
            // Add Spinny?
            // TRAIN FROM ELEMENT POST REQ
            postReq("/api/models/train", {
                imageId: IMAGES[datasetsElement.selectedIndex].id,
                imagesToUse: imagesToUse,
                modelId: el.modelId,
                knobs: {}
            }, results => {
                modelsInUse[i].trained = true;
                modelsInUse[i].results = results;
                setModelsHTML();
            });
        });
    });
}

function trainModelHTML(userModelObj) {
    return `<div class="algorithm" id="${userModelObj.id}">
                <input type="button" class="deleteBtn" value="x" id="a${userModelObj.id}delBtn">
                <h3>${MODELS.find(e => e.id == userModelObj.modelId).name}</h3>
                <p>${MODELS.find(e => e.id == userModelObj.modelId).desc}</p>
                <input type="button" value="Train" class="train" id="a${userModelObj.id}trainBtn">
            </div>`;
}

function trainedModelHTML(userModelObj) {
    return trainModelHTML(userModelObj);
}

function setImages(response) {
    IMAGES = response;
    initImages();
}

function setImagesPlaceholder() {
    IMAGES = [{
        id: 1,
        name: "MNIST",
        desc: "The MNIST database is a large database of handwritten digits that is commonly used for training various image processing systems. The database is also widely used for training and testing in the field of machine learning.",
        count: 45000,
        classes: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    }, {
        id: 2,
        name: "Other",
        desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam vel labore quos sit minus corrupti voluptatibus, sequi.",
        count: 9000,
        classes: ["x", "y", "z"]
    }];
    initImages();
}

function setModels(response) {
    MODELS = response;
    initModels();
}

function setModelsPlaceholder() {
    MODELS = [{
        id: 1,
        name: "TensorFlow Transfer Learner",
        desc: "Example text."
    }, {
        id: 2,
        name: "BrainJS CNN",
        desc: "Example text two."
    }];
    initModels();
}