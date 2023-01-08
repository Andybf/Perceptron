/*
 * Perceptron Project
 * Anderson Bucchianico - jan/2023
*/

class Canvas {
    canvas;
    context;
    clearColor;

    constructor(canvasId, clearColor) {
        this.canvas = document.querySelector(canvasId);
        this.context = this.canvas.getContext('2d');
        this.clearColor = clearColor;
        
        this.canvas.width = 32;
        this.canvas.height = 32;

        this.clear();
    }

    clear() {
        this.context.fillStyle = this.clearColor;
        this.context.fillRect(0,0, this.canvas.width, this.canvas.height);
    }

    drawCircle() {
        this.clear();
        let x = randBetween(16,this.canvas.width/2,0);
        let y = randBetween(16,this.canvas.width/2,0);
        let radiusX = randBetween(8,this.canvas.width/2,0);
        let radiusY = randBetween(8,this.canvas.width/2,0);
        let rotation = Math.PI;
        let startAngle = 0;
        let endAngle = 2*Math.PI;
    
        this.context.fillStyle = 'black';
        this.context.beginPath();
        this.context.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
        this.context.fill();
        this.context.closePath();
    }

    drawRect () {
        this.clear();
        let x = randBetween(1,16,0);
        let y = randBetween(1,16,0);
        let w = randBetween(12,16,0);
        let h = randBetween(12,16,0);
        this.context.fillStyle = 'black';
        this.context.fillRect(x,y,w,h);
    }

    drawLightData(brain){
        let x = 0
        let y = 0;
        brain.forEach( neuron => {
            this.context.fillStyle = `hsl(${180-neuron.connectionWeight*100/90}, 50%, 50%)`;
            this.context.fillRect(x,y,1,1);
            x++;
            if (x == 32) {
                y++;
                x = 0;
            }
        });
    }

    exportCanvasImage(){
        let imgd = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
        let lightArray = [];
        for (let c=0; c<imgd.length; c+=4) {
            lightArray.push( (Math.max(imgd[c],imgd[c+1],imgd[c+2]) + Math.min(imgd[c],imgd[c+1],imgd[c+2]))/2 );
        }
        return lightArray;
    }

    getCurrentImageBias() {
        let sum = 0;
        this.exportCanvasImage().forEach( lightPoint => {
            sum += lightPoint;
        });
        return sum;
    }
}

class Perceptron {

    brain = new Array();
    receivedImageValue;
    realImage;

    constructor() {
        this.receivedImageValue = 0;
        for (let x=0; x<1024; x++) {
            this.brain.push({
                light : 0,
                connectionWeight : 0
            });
        }
    }

    recieveImage(lightArray) {
        lightArray.forEach( (lightPoint, index) => {
            this.brain[index].light = lightPoint;
        });
    }

    guessWhatImageIs() {
        this.brain.forEach( neuron => {
            this.receivedImageValue += neuron.light * neuron.connectionWeight
        });
        if (this.receivedImageValue > this.realImage.value) {
            console.log('detected: '+ this.realImage.name);
            this.brain.forEach( neuron => {
                neuron.connectionWeight -= neuron.light/90;
            });
            this.realImage.value = this.receivedImageValue;
        } else {
            this.brain.forEach( neuron => {
                neuron.connectionWeight += neuron.light/90;
            });
        }
        this.receivedImageValue = 0;
    }
}

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

function randBetween(minSize, maxSize, decimals) {
    return Number((Math.random() * (maxSize - minSize) + minSize).toFixed(decimals));
}

function activatePerceptron() {
    perceptron.recieveImage(inputCanvas.exportCanvasImage());
    perceptron.guessWhatImageIs();
    outputCanvas.drawLightData(perceptron.brain);
}

function main() {
    let intervalId = 0;
    window.addEventListener('keyup', event => {
        switch(event.key) {
            case '1':
                inputCanvas.drawRect();
                perceptron.realImage = rect;
                activatePerceptron();
                break;
            case '2':
                inputCanvas.drawCircle();
                perceptron.realImage = circle;
                activatePerceptron();
                break;
            case 't':
                if (intervalId == 0) {
                    intervalId = setInterval(() => {
                        if(randBetween(1,2,0)>1) {
                            inputCanvas.drawCircle();
                            perceptron.realImage = circle;
                        } else {
                            inputCanvas.drawRect();
                            perceptron.realImage = rect;
                        }
                        activatePerceptron();
                    },1500);
                }
                break;
            case 'p':
                clearInterval(intervalId);
                break;
            case 'c':
                inputCanvas.clear();
                break;
        }
    });

    inputCanvas = new Canvas('#inputCanvas','#E0E8F6');
    outputCanvas = new Canvas('#outputCanvas','#F6E8E0');
    perceptron = new Perceptron();
}