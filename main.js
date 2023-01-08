/*
 * Perceptron Project
 * Anderson Bucchianico - jan/2023
*/

let Perceptron;
let inputCanvas;
let outputCanvas;
let graphCanvas;
let perceptron;
let rect = {
    name : 'rectangle',
    value : 0
};
let circle = {
    name : 'circle',
    value : 0
};
let successCount = 0;
let currentIteration = 0;
let mapData = new Map();
let trainingIntervalId = 0;

async function main() {
    await import('./imageCanvas.js').then( ( appClassDefinition) => {
        customElements.define("cmp-image-canvas", appClassDefinition.default);
    });
    await import('./graphCanvas.js').then( ( appClassDefinition) => {
        customElements.define("cmp-graph-canvas", appClassDefinition.default);
    });
    await import('./perception.js').then( ( appClassDefinition) => {
        Perceptron = appClassDefinition.default;
    });

    window.addEventListener('keyup', event => {
        handleKeyEvent(event);
    });

    inputCanvas = document.querySelector('#input-canvas');
    outputCanvas = document.querySelector('#output-canvas');
    graphCanvas = document.querySelector('#graph-canvas');
    perceptron = new Perceptron();
}

function activatePerceptron() {
    let isSuccess = false;
    perceptron.recieveImage(inputCanvas.exportCanvasImage());
    isSuccess = perceptron.guessWhatImageIs();
    outputCanvas.drawLightData(perceptron.brain);
    return isSuccess;
}

function handleKeyEvent(event) {
    switch(event.key) {
        case '1':
            inputCanvas.drawRect();
            perceptron.realImage = rect;
            console.log(`${rect.name} detected? ${activatePerceptron()}`);
            break;
        case '2':
            inputCanvas.drawCircle();
            perceptron.realImage = circle;
            console.log(`${circle.name} detected? ${activatePerceptron()}`);
            break;
        case 't': //training
            startTraining();
            break;
        case 'p': // pause
            clearInterval(trainingIntervalId);
            trainingIntervalId = 0;
            break;
        case 'c': // clear
            inputCanvas.clear();
            break;
    }
}

function startTraining() {
    if (trainingIntervalId != 0) {
        return;
    }
    trainingIntervalId = setInterval(() => {
        if(randBetween(1,2,0) > 1) {
            inputCanvas.drawCircle();
            perceptron.realImage = circle;
        } else {
            inputCanvas.drawRect();
            perceptron.realImage = rect;
        }
        ;
        currentIteration++;
        if(activatePerceptron()) {
            successCount++;
        }
        if (currentIteration % 100 == 0) {
            mapData.set(currentIteration,Number((successCount*100)/currentIteration).toFixed(1));
            graphCanvas.drawGraphOnCanvas(mapData);
        }
    },0.1);
}

function randBetween(minSize, maxSize, decimals) {
    return Number((Math.random() * (maxSize - minSize) + minSize).toFixed(decimals));
}