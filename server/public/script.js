let IMAGES, MODELS, rangeElement, datasetsElement, modelsInUse = [], imagesToUse = 0, idCount = 0, rid = Math.random().toString(36).substr(2, 16), historicalResults = [], predictionData = [];

window.addEventListener("load", () => {
    // getReq("https://jsonplaceholder.typicode.com/todos/1", console.log, (res) => console.log("Fu", res));
    getReq("/api/images", setImages, setImagesPlaceholder);
    getReq("/api/models", setModels, setModelsPlaceholder);
    rangeElement = document.getElementById("imageCount");
    rangeElement.addEventListener("input", imageCountScroll);
    datasetsElement = document.getElementById("datasets");
    datasetsElement.addEventListener("change", () => imageChange(datasetsElement.selectedIndex));
    document.getElementById("addAlgorithm").addEventListener("click", addAlgorithmEventListener);
    document.getElementById("trainAll").addEventListener("click", addTrainAllEventListener);
    // resultsGraph();
});

function addAlgorithmEventListener() {
    let selectedId = document.getElementById("algorithmsList").selectedIndex;
    modelsInUse.push({ id: idCount++, modelId: MODELS[selectedId].id, predictions: [], trained: false, training: false, split: 0.75, epochs: 5 });
    setModelsHTML();
}

function addTrainAllEventListener() {
    modelsInUse.forEach((data, i) => {
        if (!modelsInUse[i].training) {
            modelsInUse[i].training = true;
            modelsInUse[i].classes = IMAGES[datasetsElement.selectedIndex].classes;
            // TRAIN FROM ELEMENT POST REQ
            postReq("/api/models/train", {
                uid: rid,
                mid: data.id,
                imageId: IMAGES[datasetsElement.selectedIndex].id,
                imagesToUse: imagesToUse,
                modelId: data.modelId,
                knobs: {
                    split: data.split,
                    epochs: data.epochs
                }
            }, results => {
                modelsInUse[i].predictions = [];
                modelsInUse[i].trained = true;
                modelsInUse[i].training = false;
                modelsInUse[i].results = results;
                // Data
                let data = {
                    model: modelsInUse[i],
                    result: results,
                    dataset: {
                        id: datasetsElement.selectedIndex,
                        count: parseInt(parseInt(imagesToUse) * parseFloat(modelsInUse[i].split))
                    }
                };
                historicalResults.push(data);
                predictionData.push(historicalResultTodataPoint(data));
                // Update
                setModelsHTML();
                resultsGraph();
            });
        }
    }); setModelsHTML();
}

function getReq(url, okayHandler, errorHandler) {
    const xhr = new XMLHttpRequest();
    xhr.timeout = 1000 * 60 * 60;
    xhr.open("GET", url);
    xhr.send();
    xhr.onload = () => xhr.status == 200 ? okayHandler(JSON.parse(xhr.response)) : errorHandler(xhr);
    xhr.onerror = errorHandler;
}

function postReq(url, json, callback) {
    let xhr = new XMLHttpRequest();
    xhr.timeout = 1000 * 60 * 60;
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(json));
    xhr.onreadystatechange = () => (xhr.readyState == 4 && xhr.status == 200) ? callback(JSON.parse(xhr.responseText)) : null;
}

function initImages() {
    document.getElementById("datasets").innerHTML = IMAGES.map(set => `<option value="${set.name}">${set.name}</option>`);
    imageChange(0);
}

function imageChange(index) {
    document.getElementById("datasetText").innerHTML = `${IMAGES[index].desc ? IMAGES[index].desc + "<br/><br/> " : ""} Classes: ['${IMAGES[index].classes.join("', '")}']`;
    rangeElement.min = IMAGES[index].classes.length * 10;
    rangeElement.max = IMAGES[index].count;
    rangeElement.value = IMAGES[index].count;
    rangeElement.step = IMAGES[index].classes.length;
    imageCountScroll();
}

function imageCountScroll() {
    imagesToUse = rangeElement.value;
    document.getElementById("imageCountText").innerHTML = `Use ${rangeElement.value} images out of ${rangeElement.max}.`;
    modelsInUse.forEach(el => {
        if (!el.trained) {
            document.getElementById(`a${el.id}splitTraining`).innerHTML = Math.round(imagesToUse * el.split);
            document.getElementById(`a${el.id}splitTesting`).innerHTML = Math.round(imagesToUse * (1 - el.split));
        }
    }); setModelsHTML();
}

function initModels() {
    document.getElementById("algorithmsList").innerHTML = MODELS.map((m, i) => `<option id="m${i}">${m.name}</option>`);
    modelsInUse = MODELS.map(m => {
        return {
            id: idCount++,
            modelId: m.id,
            predictions: [],
            trained: false,
            training: false,
            split: 0.75,
            epochs: 5
        };
    });
    setModelsHTML();
}

function setModelsHTML() {
    document.getElementById("algorithms").innerHTML = modelsInUse.map(m => m.training ? trainingModelHTML(m) : m.trained ? trainedModelHTML(m) : trainModelHTML(m)).join("");
    setupModelEventListeners(modelsInUse);
    modelsInUse.forEach(m => {
        if (m.trained) {
            Matrix({
                container : `#cm${m.id}`,
                data      : m.results.confusionMatrix,
                labels    : m.classes
            });
        }
    });
}

function setupModelEventListeners(modelArr) {
    modelArr.forEach(el => {
        let i = modelsInUse.findIndex(el2 => el2.id == el.id);
        // Delete
        document.getElementById(`a${el.id}delBtn`).addEventListener("click", () => {
            modelsInUse.splice(i, 1);
            setModelsHTML();
        });
        // Training Split
        document.getElementById(`a${el.id}splitTxt`).innerHTML = Math.round(parseFloat(document.getElementById(`a${el.id}split`).value) * 100) + "%"
        document.getElementById(`a${el.id}split`).addEventListener("input", () => {
            let value = parseFloat(document.getElementById(`a${el.id}split`).value);
            document.getElementById(`a${el.id}splitTxt`).innerHTML = Math.round(value * 100) + "%";
            document.getElementById(`a${el.id}splitTraining`).innerHTML = Math.round(imagesToUse * value);
            document.getElementById(`a${el.id}splitTesting`).innerHTML = Math.round(imagesToUse * (1 - value));
            modelsInUse[i].split = value;
        });
        // Epochs
        document.getElementById(`a${el.id}epochsTxt`).innerHTML = document.getElementById(`a${el.id}epochs`).value;
        document.getElementById(`a${el.id}epochs`).addEventListener("input", () => {
            let value = parseInt(document.getElementById(`a${el.id}epochs`).value);
            document.getElementById(`a${el.id}epochsTxt`).innerHTML = value;
            modelsInUse[i].epochs = value;
        });
        // Train
        document.getElementById(`a${el.id}trainBtn`).addEventListener("click", () => {
            document.getElementById(`eval${el.id}`).innerHTML = "<div class='loader'></div>";
            document.getElementById(`a${el.id}trainBtn`).disabled = true;
            document.getElementById(`a${el.id}trainBtn`).value = "N/A";
            modelsInUse[i].training = true;
            modelsInUse[i].classes = IMAGES[datasetsElement.selectedIndex].classes;
            // TRAIN FROM ELEMENT POST REQ
            postReq("/api/models/train", {
                uid: rid,
                mid: el.id,
                imageId: IMAGES[datasetsElement.selectedIndex].id,
                imagesToUse: imagesToUse,
                modelId: el.modelId,
                knobs: {
                    split: el.split,
                    epochs: el.epochs
                }
            }, results => {
                modelsInUse[i].predictions = [];
                modelsInUse[i].trained = true;
                modelsInUse[i].training = false;
                modelsInUse[i].results = results;
                setModelsHTML();
            });
        });
        // Download
        if (document.getElementById(`a${el.id}downloadBtn`)) document.getElementById(`a${el.id}downloadBtn`).addEventListener("click", () => alert("The download feature is not available yet!"));
        // Predict
        if (el.trained) {
            let fileUploader = document.getElementById(`a${el.id}fileUpload`);
            if (fileUploader) {
                fileUploader.addEventListener('change', () => {
                    [...document.getElementById(`a${el.id}fileUpload`).files].forEach(file => {
                        let fr = new FileReader();
                        fr.readAsArrayBuffer(file);
                        fr.onload = (e) => {
                            let imgBuffer = new Uint8Array(e.target.result);
                            postReq("/api/models/predictOne", {
                                uid: rid,
                                mid: el.id,
                                Uint8ArrayBuffer: imgBuffer
                            }, result => {
                                console.log("Prediction: ", result);
                                let reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload = (eOnLoad) => {
                                    let imgSrc = eOnLoad.target.result, prediction = result.prediction;
                                    modelsInUse[i].predictions.push({ imgSrc, prediction });
                                    document.getElementById(`a${el.id}predictions`).innerHTML = predictionHTML(imgSrc, prediction) + document.getElementById(`a${el.id}predictions`).innerHTML;
                                };                            
                            });
                        }
                    })
                });
            }
        }
    });
}

function modelHTML(userModelObj) {
    return `<input type="button" class="deleteBtn" value="x" id="a${userModelObj.id}delBtn">
            <h3>${MODELS.find(e => e.id == userModelObj.modelId).name}</h3>
            <p>${MODELS.find(e => e.id == userModelObj.modelId).desc}</p>
            <h4>Customize</h4>
            <div class="imageSplit">
                <div><p><b>Training Images</b></p><p id="a${userModelObj.id}splitTraining">${Math.round(imagesToUse * userModelObj.split)}</p></div>
                <div><p><b>Testing Images</b></p><p id="a${userModelObj.id}splitTesting">${Math.round(imagesToUse * (1 - userModelObj.split))}</p></div>
            </div>
            <div class="knobs">
                <div class="split"><label for="a${userModelObj.id}split"><p>Training Split: </p></label><input id="a${userModelObj.id}split" class="splitInput" type="range" min="0.1" value="${userModelObj.split}" max="0.9" step="0.01" /><p id="a${userModelObj.id}splitTxt">75%</p></div>
                <div class="epochs"><label for="a${userModelObj.id}epochs"><p>Epochs: </p></label><input id="a${userModelObj.id}epochs" class="epochInput" type="range" min="1" value="${userModelObj.epochs}" max="100" /><p id="a${userModelObj.id}epochsTxt">5</p></div>
            </div>`
}

function trainModelHTML(userModelObj) {
    return `<div class="algorithm" id="${userModelObj.id}">
                ${modelHTML(userModelObj)}
                <input type="button" value="Train" class="train" id="a${userModelObj.id}trainBtn">
                <div class="eval" id="eval${userModelObj.id}"></div>
            </div>`;
}

function trainingModelHTML(userModelObj) {
    return `<div class="algorithm" id="${userModelObj.id}">
                ${modelHTML(userModelObj)}
                <input type="button" value="N/A" class="train" id="a${userModelObj.id}trainBtn" disabled>
                <div class="eval" id="eval${userModelObj.id}"><div class='loader'></div></div>
            </div>`;
}

function trainedModelHTML(userModelObj) {
    return `<div class="algorithm" id="${userModelObj.id}">
                ${modelHTML(userModelObj)}
                <input type="button" value="Re-train" class="train retrain" id="a${userModelObj.id}trainBtn">
                <input type="button" value="D" class="train download" id="a${userModelObj.id}downloadBtn">
                <div class="predictDiv">
                    <label for="a${userModelObj.id}fileUpload"><p>Predict: </p></label><input type="file" name="" id="a${userModelObj.id}fileUpload" multiple>
                    <div id="a${userModelObj.id}predictions" class="predictionsContainer">
                        ${ userModelObj.predictions.map(p => predictionHTML(p.imgSrc, p.prediction)).reverse().join("") }
                    </div>
                </div>
                <div class="eval" id="eval${userModelObj.id}">
                    <div class="time">
                        <p><b>Setup Time</b></p>
                        <p>${userModelObj.results.setUpTime}s</p>
                    </div>
                    <div class="time">
                        <p><b>Training Time</b></p>
                        <p>${userModelObj.results.trainTime}s</p>
                    </div>
                    <div class="time">
                        <p><b>Eval' Time</b></p>
                        <p>${userModelObj.results.evaluateTime}s</p>
                    </div>
                    <h4>Confusion Matrix</h4>
                    <div id="cm${userModelObj.id}"></div>
                    <div class="accuracy">
                        <p><b>Accuracy</b></p>
                        <p>${userModelObj.results.accuracy}%</p>
                    </div>
                </div>  
            </div>`;
}

function predictionHTML(src, txt) {
    return `<div class="prediction">
                <img src="${src}">
                <p>${txt}</p>
            </div>`
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

function resultsGraph() {
    // Reset hack due to documented way to add new data or reset the chart, without it having artifacts
    document.getElementById("results").innerHTML = "";

    var parcoords = d3.parcoords()("#results")
    .data(predictionData)
        .color(d3.color(randomHex()))
        // .alpha(0.25)
        .composite("darken")
        .margin({ top: 24, left: 150, bottom: 12, right: 0 })
        .mode("queue")
        .render()
        .brushMode("1D-axes");
    
    parcoords.svg.selectAll("text")
        .style("font", "10px sans-serif");
}

function historicalResultTodataPoint(result) {
    return {
        modelName: MODELS[result.model.modelId].name,
        datasetName: IMAGES[result.dataset.id].name,
        datasetCount: result.dataset.count,
        epochs: result.model.epochs,
        setUpTime: result.result.setUpTime,
        trainTime: result.result.trainTime,
        evaluateTime: result.result.evaluateTime,
        accuracy: result.result.accuracy
    }
}

function randomHex() {
    return `#${(Math.random()*(1<<24)|0).toString(16)}`;
}