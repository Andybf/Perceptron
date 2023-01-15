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
        
        this.canvas.width = 64;
        this.canvas.height = 64;

        this.clearColor = '#E0E8F6';

        this.clear();
    }

    clear() {
        this.context.fillStyle = this.clearColor;
        this.context.fillRect(0,0, this.canvas.width, this.canvas.height);
    }

    drawCircle() {
        this.clear();
        let x = randBetween(this.canvas.width/2,this.canvas.width/2,0);
        let y = randBetween(this.canvas.width/2,this.canvas.width/2,0);
        let radiusX = randBetween(this.canvas.width/4,this.canvas.width/2,0);
        let radiusY = randBetween(this.canvas.width/4,this.canvas.width/2,0);
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
        let x = randBetween(1,this.canvas.width/2,0);
        let y = randBetween(1,this.canvas.width/2,0);
        let w = randBetween(this.canvas.width/2,this.canvas.width/2,0);
        let h = randBetween(this.canvas.width/2,this.canvas.width/2,0);
        this.context.fillStyle = 'black';
        this.context.fillRect(x,y,w,h);
    }

    drawCharacter(message) {
        this.clear();
        this.context.font = `${this.canvas.width/2}px Arial`;
        this.context.fillStyle = 'black';
        this.context.textAlign = 'center';
        this.context.fillText(
            message[0],
            randBetween(8,this.canvas.width-8,0),
            randBetween(16,this.canvas.height,0)
        );
    }

    drawLightData(brain){
        let x = 0
        let y = 0;
        brain.forEach( neuron => {
            let value = Math.abs(neuron.connectionWeight);
            let hex = new Array();
            hex.push((value & 0xFF0000) >> 16);
            hex.push((value & 0x00FF00) >> 8);
            hex.push((value & 0x0000FF) >> 0);
            this.context.fillStyle = `rgb(${hex[0]},${hex[1]},${hex[2]})`;
            this.context.fillRect(x,y,1,1);
            x++;
            if (x == 64) {
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