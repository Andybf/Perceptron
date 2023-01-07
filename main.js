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
            // if (neuron.connectionWeight*100/255 > 0) {
            //     debugger;
            // }
            this.context.fillStyle = `hsl(${180-neuron.connectionWeight*100/360}, 80%, 50%)`;
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
}

class Perceptron {

    brain = new Array();
    receivedImageValue;
    realImageValue;

    constructor() {
        this.receivedImageValue = 0;
        this.realImageValue = 0;
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
        if (this.receivedImageValue > this.realImageValue) {
            console.log('detected!');
            this.brain.forEach( neuron => {
                neuron.connectionWeight += neuron.light/360;
            });
            this.realImageValue = this.receivedImageValue;
        } else {
            this.brain.forEach( neuron => {
                neuron.connectionWeight -= neuron.light/360;
            });
        }
        this.receivedImageValue = 0;
    }
}

let inputCanvas;
let outputCanvas;
let perceptron;

function randBetween(minSize, maxSize, decimals) {
    return Number((Math.random() * (maxSize - minSize) + minSize).toFixed(decimals));
}

function main() {
    let intervalId;
    window.addEventListener('keyup', event => {
        switch(event.key) {
            case 'r':
                inputCanvas.drawRect();
                break;
            case 'c':
                inputCanvas.drawCircle();
                break;
            case 't':
                intervalId = setInterval(() => {
                    if(randBetween(1,2,0)>1) {
                        inputCanvas.drawCircle();
                    } else {
                        inputCanvas.drawRect();
                    }
                    action();
                },1);
                break;
            case 'p':
                clearInterval(intervalId);
        }
    });

    inputCanvas = new Canvas('#inputCanvas','#E0E8F6');
    outputCanvas = new Canvas('#outputCanvas','#F6E8E0');

    let circleValue = 0;
    let rectValue = 0;

    perceptron = new Perceptron();
}

function action() {
    perceptron.recieveImage(inputCanvas.exportCanvasImage());
    perceptron.guessWhatImageIs();
    outputCanvas.drawLightData(perceptron.brain);
}


