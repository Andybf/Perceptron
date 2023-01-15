/*
 * Perceptron Project
 * Anderson Bucchianico - jan/2023
*/

let Perceptron;
let inputCanvas;
let outputCanvas;
let perceptron;
let successCount = 0;

let currentIteration = 0;
let trainingIntervalId = 0;

let isTrainingOnCourse = false;

let startTrainingButton;
let stopTrainingButton;

let currentStatusInput;
let trainingSpeedInput;
let iterationCountInput;
let perceptronBiasInput;
let successRateInput;
let errorCountInput;
let successCountInput;

async function main() {
    await import('./imageCanvas.js').then( ( appClassDefinition) => {
        customElements.define("cmp-image-canvas", appClassDefinition.default);
    });
    await import('./perception.js').then( ( appClassDefinition) => {
        Perceptron = appClassDefinition.default;
    });

    stopTrainingButton = document.querySelector('button[id="reset-training"]');
    stopTrainingButton.addEventListener('click', event => {
        resetPerceptron();
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

    currentStatusInput = document.querySelector('input[id="current-status"]');
    iterationCountInput = document.querySelector('input[id="iteration-count"]');
    perceptronBiasInput = document.querySelector('input[id="perceptron-bias"]');
    successRateInput = document.querySelector('input[id="success-rate"]');
    errorCountInput = document.querySelector('input[id="error-count"]');
    successCountInput = document.querySelector('input[id="success-count"]');
    trainingSpeedInput = document.querySelector('#training-speed');

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

function stopTraining() {
    currentStatusInput.value = 'Idle';
    clearInterval(trainingIntervalId);
    trainingIntervalId = 0;
    isTrainingOnCourse = false;
}

function startTraining() {
    currentStatusInput.value = 'Training...';
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
        iterationCountInput.value = currentIteration;
        perceptronBiasInput.value = perceptron.bias.toFixed(2);
        successRateInput.value = Number((successCount*100)/currentIteration).toFixed(2);
        successCountInput.value = successCount;
        errorCountInput.value = currentIteration - successCount;
    },1000/trainingSpeedInput.value);
}

function resetPerceptron() {
    currentStatusInput.value = 'rebooted';
    inputCanvas.clear();
    outputCanvas.clear();

    iterationCountInput.value = 0;
    perceptronBiasInput.value = 0;
    successRateInput.value = 0;
    successCountInput.value = 0;
    errorCountInput.value = 0;

    perceptron = new Perceptron();
}

function randBetween(minSize, maxSize, decimals) {
    return Number((Math.random() * (maxSize - minSize) + minSize).toFixed(decimals));
}