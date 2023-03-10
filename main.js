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

let drawSymbol1Button;
let drawSymbol2Button;

let currentStatusInput;
let currentGuessInput;
let correctAnswerInput
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
    group1Input = document.querySelector('input[id="first-symbol"]');
    group2Input = document.querySelector('input[id="second-symbol"]');
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

    drawSymbol1Button = document.querySelector('button[id="draw-symbol1"]');
    drawSymbol1Button.addEventListener('click', event => {
        drawCharViaUserInput(event);
    });

    drawSymbol2Button = document.querySelector('button[id="draw-symbol2"]');
    drawSymbol2Button.addEventListener('click', event => {
        drawCharViaUserInput(event);
    });

    currentStatusInput = document.querySelector('input[id="current-status"]');
    currentGuessInput = document.querySelector('input[id="perceptron-guess"]');
    correctAnswerInput = document.querySelector('input[id="correct-answer"]');
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

    if (event.target.innerText.includes('Draw symbol')) {
        let inputId = event.target.attributes['related-input-id'].value;
        event.target.innerText = 'Cancel draw';
        currentStatusInput.value = 'Awaiting input...';
        inputCanvas.clear();
        inputCanvas.onclick = canvasEvent => {
            let posX = 64/inputCanvas.firstChild.clientWidth * canvasEvent.offsetX;
            let posY = (64/inputCanvas.firstChild.clientHeight * canvasEvent.offsetY) + inputCanvas.fontSize/3;
            inputCanvas.drawCharacter(document.querySelector('#'+inputId).value, posX, posY);
            currentGuessInput.value = document.querySelector('#'+inputId).value;
            currentIteration++;
            if(isPerceptronHasSuccess()) {
                successCount++;
                correctAnswerInput.value = currentGuessInput.value;
            } else {
                correctAnswerInput.value = (currentGuessInput.value == document.querySelector('#first-symbol').value) ?
                                            document.querySelector('#second-symbol').value :
                                            document.querySelector('#first-symbol').value;
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
            currentGuessInput.value = group1Input.value;
        } else {
            inputCanvas.drawCharacterAtRandomPosition(group2Input.value);
            currentGuessInput.value = group2Input.value;
        }
        currentIteration++;
        if(isPerceptronHasSuccess()) {
            successCount++;
            correctAnswerInput.value = currentGuessInput.value;
        } else {
            correctAnswerInput.value = (currentGuessInput.value == group1Input.value) ? group2Input.value : group1Input.value;
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
    drawSymbol1Button.disabled = (drawSymbol1Button.disabled) ? false : true;
    drawSymbol2Button.disabled = (drawSymbol2Button.disabled) ? false : true;
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