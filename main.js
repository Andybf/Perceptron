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

let group1Input;
let group2Input;

let startTrainingButton;
let resetTrainingButton;

let drawGroup1Button;
let drawGroup2Button;

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
    group1Input = document.querySelector('input[id="first-char"]');
    group2Input = document.querySelector('input[id="second-char"]');
    trainingSpeedInput = document.querySelector('#training-speed');

    resetTrainingButton = document.querySelector('button[id="reset-training"]');
    resetTrainingButton.addEventListener('click', event => {
        resetPerceptron();
    });

    startTrainingButton = document.querySelector('button[id="start-training"]');
    startTrainingButton.addEventListener('click', event => {
        if (isTrainingOnCourse) {
            stopTraining();
            toggleSettingsEdit();
            startTrainingButton.innerText = 'Start automatic training';
        } else {
            startTraining();
            toggleSettingsEdit();
            startTrainingButton.innerText = 'Stop Training';
        } 
    });

    drawGroup1Button = document.querySelector('button[id="draw-group1"]');
    drawGroup1Button.addEventListener('click', event => {
        drawCharViaUserInput(event);
    });

    drawGroup2Button = document.querySelector('button[id="draw-group2"]');
    drawGroup2Button.addEventListener('click', event => {
        drawCharViaUserInput(event);
    });

    currentStatusInput = document.querySelector('input[id="current-status"]');
    iterationCountInput = document.querySelector('input[id="iteration-count"]');
    perceptronBiasInput = document.querySelector('input[id="perceptron-bias"]');
    successRateInput = document.querySelector('input[id="success-rate"]');
    errorCountInput = document.querySelector('input[id="error-count"]');
    successCountInput = document.querySelector('input[id="success-count"]');
    inputCanvas = document.querySelector('#input-canvas');
    outputCanvas = document.querySelector('#output-canvas');
    perceptron = new Perceptron();
}

function drawCharViaUserInput(event) {
    group1Input.disabled = (group1Input.disabled) ? false : true;;
    group2Input.disabled = (group2Input.disabled) ? false : true;;
    trainingSpeedInput.disabled = (trainingSpeedInput.disabled) ? false : true;
    startTrainingButton.disabled = (startTrainingButton.disabled) ? false : true;
    resetTrainingButton.disabled = (resetTrainingButton.disabled) ? false : true;
    Array.from(document.querySelectorAll('.draw-button')).forEach( element => {
        element.disabled = true;
    });
    event.target.disabled = false;

    if (event.target.innerText.includes('Draw group')) {
        let inputValue = event.target.value;
        event.target.innerText = 'Cancel draw';
        currentStatusInput.value = 'Awaiting input...';
        inputCanvas.clear();
        inputCanvas.onclick = canvasEvent => {
            let posX = 64/inputCanvas.clientWidth * canvasEvent.offsetX;
            let posY = 64/inputCanvas.clientHeight * canvasEvent.offsetY;
            inputCanvas.drawCharacter(document.querySelector('#'+inputValue).value, posX, posY);
            currentIteration++;
            if(isPerceptronHasSuccess()) {
                successCount++;
            }
            updateInterface();
        };
    } else {
        inputCanvas.onclick = null;
        event.target.innerText = event.target.title;
        currentStatusInput.value = 'Idle';
        Array.from(document.querySelectorAll('.draw-button')).forEach( element => {
            element.disabled = false;
        });
    }
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
            inputCanvas.drawCharacterAtRandomPosition(group1Input.value);
        } else {
            inputCanvas.drawCharacterAtRandomPosition(group2Input.value);
        }
        currentIteration++;
        if(isPerceptronHasSuccess()) {
            successCount++;
        }
        updateInterface();
    },1000/trainingSpeedInput.value);
    
}

function updateInterface() {
    iterationCountInput.value = currentIteration;
    perceptronBiasInput.value = perceptron.bias.toFixed(2);
    successRateInput.value = Number((successCount*100)/currentIteration).toFixed(2) + '%';
    successCountInput.value = successCount;
    errorCountInput.value = currentIteration - successCount;
}

function toggleSettingsEdit() {
    group1Input.disabled = (group1Input.disabled) ? false : true;
    group2Input.disabled = (group2Input.disabled) ? false : true;
    trainingSpeedInput.disabled = (trainingSpeedInput.disabled) ? false : true;
    resetTrainingButton.disabled = (resetTrainingButton.disabled) ? false : true;
    drawGroup1Button.disabled = (drawGroup1Button.disabled) ? false : true;
    drawGroup2Button.disabled = (drawGroup2Button.disabled) ? false : true;
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
    currentIteration = 0;
    successCount = 0;
    perceptron = new Perceptron();
}

function randBetween(minSize, maxSize, decimals) {
    return Number((Math.random() * (maxSize - minSize) + minSize).toFixed(decimals));
}