/*
 * Perceptron Project
 * Anderson Bucchianico - jan/2023
*/

class Canvas {
    canvas;
    context;

    constructor() {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        
        this.canvas.width = 32;
        this.canvas.height = 32;

        this.clear();
    }

    clear() {
        this.context.fillStyle = '#E0E8F6';
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

    exportCanvasImage(){
        let imgd = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
        let lightArray = [];
        for (let c=0; c<imgd.length; c+=4) {
            lightArray.push( (Math.max(imgd[c],imgd[c+1],imgd[c+2]) + Math.min(imgd[c],imgd[c+1],imgd[c+2]))/2 );
        }
        console.log(lightArray);
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
                canvas.drawRect();
                break;
            case 'c':
                canvas.drawCircle();
        }
    });

    let canvas = new Canvas();
    canvas.drawRect();
    canvas.exportCanvasImage();

    let circleValue = 0;
    let rectValue = 0;

    let perceptron = new Perceptron();

}


