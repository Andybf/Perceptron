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
        
        this.context.fillStyle = '#E0E8F6';
        
        this.context.fillRect(0,0, this.canvas.width, this.canvas.height);
        this.drawCircle();
        this.exportCanvasImage();
    }

    drawCircle() {
        let x= this.canvas.width/2;
        let y= this.canvas.height/2;
        let radiusX = this.canvas.width/2;
        let radiusY = this.canvas.height/2;
        let rotation = Math.PI;
        let startAngle = 0;
        let endAngle = 2*Math.PI;
    
        this.context.fillStyle = 'black';
        this.context.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
        this.context.fill();
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
        }
    }
}

function main() {
    let canvas = new Canvas();
}


