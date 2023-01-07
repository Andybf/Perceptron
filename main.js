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
        let x = randBetween(8,this.canvas.width-8,0);
        let y = randBetween(8,this.canvas.width-8,0);
        let radiusX = randBetween(4,this.canvas.width/4,0);
        let radiusY = randBetween(4,this.canvas.width/4,0);
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
        let w = randBetween(1,16,0);
        let h = randBetween(1,16,0);
        this.context.fillStyle = 'black';
        this.context.fillRect(x,y,w,h);
    }

    drawLightData(brain){
        let x = 0
        let y = 0;
        brain.forEach( neuron => {
            this.context.fillStyle = `hsl(180, 80%, ${neuron.connectionWeight*255}%)`;
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
    }

    recieveImage(lightArray) {
        lightArray.forEach( lightPoint => {
            this.brain.push({
                light : lightPoint,
                connectionWeight : 0
            });
        });
    }

    guessWhatImageIs() {
        this.brain.forEach( neuron => {
            this.receivedImageValue += neuron.light * neuron.connectionWeight
        });
        if (this.receivedImageValue >= this.realImageValue) {
            console.log('detected!');
            this.brain.forEach( neuron => {
                this.connectionWeight += neuron.light/255;
            });
            this.realImageValue = this.receivedImageValue;
        } else {
            console.log('Not detected');
            this.brain.forEach( neuron => {
                this.connectionWeight -= neuron.light/255;
            });
        }
    }
}

function randBetween(minSize, maxSize, decimals) {
    return Number((Math.random() * (maxSize - minSize) + minSize).toFixed(decimals));
}   

function main() {

    window.addEventListener('keyup', event => {
        switch(event.key) {
            case 'r':
                inputCanvas.drawRect();
                break;
            case 'c':
                inputCanvas.drawCircle();
        }
        perceptron.recieveImage(inputCanvas.exportCanvasImage());
        outputCanvas.drawLightData(perceptron.brain);
    });

    let inputCanvas = new Canvas('#inputCanvas','#E0E8F6');
    let outputCanvas = new Canvas('#outputCanvas','#F6E8E0');

    let circleValue = 0;
    let rectValue = 0;

    let perceptron = new Perceptron();
}


