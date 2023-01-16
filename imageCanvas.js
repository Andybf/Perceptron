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

    drawCharacterAtRandomPosition(message) {
        let x = randBetween(8,this.canvas.width-8,0);
        let y = randBetween(16,this.canvas.height,0);
        this.drawCharacter(message, x, y);
    }

    drawCharacter(message, x, y) {
        this.clear();
        let fontSize = this.canvas.width/2
        this.context.font = `${fontSize}px Arial`;
        this.context.fillStyle = 'black';
        this.context.textAlign = 'center';
        this.context.fillText(message[0], x, y+fontSize/3);
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