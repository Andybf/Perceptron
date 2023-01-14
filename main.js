/*
 * Perceptron Project
 * Anderson Bucchianico - jan/2023
*/

let Perceptron;
let inputCanvas;
let outputCanvas;
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

let isTrainingOnCourse = false;

let startTrainingButton;
let stopTrainingButton;

async function main() {
    await import('./imageCanvas.js').then( ( appClassDefinition) => {
        customElements.define("cmp-image-canvas", appClassDefinition.default);
    });
    await import('./perception.js').then( ( appClassDefinition) => {
        Perceptron = appClassDefinition.default;
    });

    stopTrainingButton = document.querySelector('button[id="reset-training"]');
    stopTrainingButton.addEventListener('click', event => {

    });

    startTrainingButton = document.querySelector('button[id="start-training"]');
    startTrainingButton.addEventListener('click', event => {
        if (isTrainingOnCourse) {
            stopTraining();
            startTrainingButton.innerText = 'Start automatic training';
        } else {
            startTraining();
            startTrainingButton.innerText = 'Stop Training';
        } 
    });

    let iterationCount = document.querySelector('#iteration-count');
    let successRate = document.querySelector('#success-rate');

    inputCanvas = document.querySelector('#input-canvas');
    outputCanvas = document.querySelector('#output-canvas');
    perceptron = new Perceptron();
}

function isPerceptronHasSuccess() {
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
            currentIteration++;
            if (isPerceptronHasSuccess()) {
                successCount++;
                console.log(`${rect.name} detected? true`);
            }           
            break;
        case '2':
            inputCanvas.drawCircle();
            currentIteration++;
            if (isPerceptronHasSuccess()) {
                successCount++;
                console.log(`${circle.name} detected? true`);
            }
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

function stopTraining() {
    clearInterval(trainingIntervalId);
    trainingIntervalId = 0;
    isTrainingOnCourse = false;
}

function startTraining() {
    isTrainingOnCourse = true;
    if (trainingIntervalId != 0) {
        return;
    }
    trainingIntervalId = setInterval(() => {
        if(randBetween(1,2,0) > 1) {
            inputCanvas.drawCircle();
        } else {
            inputCanvas.drawRect();
        }
        currentIteration++;
        if(isPerceptronHasSuccess()) {
            successCount++;
        }
        if (currentIteration % 100 == 0) {
            mapData.set(currentIteration,Number((successCount*100)/currentIteration).toFixed(1));
        }
    },0.1);
}

function randBetween(minSize, maxSize, decimals) {
    return Number((Math.random() * (maxSize - minSize) + minSize).toFixed(decimals));
}