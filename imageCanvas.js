/*
 * Perceptron Project
 * Anderson Bucchianico - jan/2023
*/

export default class ImageCanvas extends HTMLElement {

    canvas;
    context;
    clearColor;

    constructor() {
        super();
        this.innerHTML = '<canvas></canvas>';

        this.canvas = this.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        
        this.canvas.width = 32;
        this.canvas.height = 32;

        this.clearColor = '#E0E8F6';

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
        let w = randBetween(16,16,0);
        let h = randBetween(16,16,0);
        this.context.fillStyle = 'black';
        this.context.fillRect(x,y,w,h);
    }

    drawLightData(brain){
        let x = 0
        let y = 0;
        brain.forEach( neuron => {
            this.context.fillStyle = `hsl(${neuron.connectionWeight*100/360}, 50%, 50%)`;
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