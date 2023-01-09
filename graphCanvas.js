/*
 * Perceptron Project
 * Anderson Bucchianico - jan/2023
*/

export default class GraphCanvas extends HTMLElement {

    maxHeight = new Number();
    context;
    canvas;

    constructor() {
        super();
        this.innerHTML = '<canvas></canvas>';
    }

    connectedCallback() {
        this.canvas = this.querySelector('canvas');
        this.canvas.height = window.innerHeight/2;
        this.canvas.width = window.innerWidth;
        this.context = this.canvas.getContext('2d');
        this.clearCanvas();
    }

    clearCanvas() {
        this.context.fillStyle = '#EFEFEF';
        this.context.fillRect(0,0, this.canvas.width, this.canvas.height);
    }

    drawGraphOnCanvas(mapData) {
        this.clearCanvas();
        this.maxHeight = Math.max(...mapData.values()) + 10;
        let index = 0;
        this.context.beginPath();
        this.context.textAlign = 'center';
        this.context.fillStyle = 'black';
        this.context.strokeStyle = 'black';
        this.context.font = '14px Arial';

        mapData.forEach( (key, value) => {
            let x = this.pointToPixelWidth(mapData) * index;
            x += this.applyPaddingToCanvas(mapData.size, index, 20);
            let y = this.pointToPixelHeight(key);
            this.context.lineTo(x, y);
            this.context.fillText(key, x, y - 20);
            this.context.fillText(value, x, this.canvas.height - 20);
            index++;
        });
        this.context.stroke();
        this.context.closePath();
    }

    applyPaddingToCanvas(length, index, padValue) {
        length /= 2;
        if (index > length) {
            return -padValue;
        } else if (index == length) {
            return -20;
        } else if (index < length) {
            return +padValue;
        }
    }

    pointToPixelWidth(mapData) {
        return this.canvas.width / (Array.from(mapData.values()).length -1);
    }

    pointToPixelHeight(key) {
        return this.canvas.height-((key*this.canvas.height)/ this.maxHeight);
    }
}