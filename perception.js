/*
 * Perceptron Project
 * Anderson Bucchianico - jan/2023
*/

export default class Perceptron {

    brain = new Array();
    bias = 0;

    constructor() {
        for (let x=0; x<64*64; x++) {
            this.brain.push({
                light : 0,
                connectionWeight : 0
            });
        }
    }

    recieveImage(lightArray) {
        lightArray.forEach( (lightPoint, index) => {
            this.brain[index].light = (lightPoint*100)/255;
        });
    }

    guessWhatImageIs() {
        let isSuccess = false;
        let receivedImageValue = 0;

        this.brain.forEach( neuron => {
            receivedImageValue += neuron.light * neuron.connectionWeight;
        });
        if (receivedImageValue > this.bias) {
            this.brain.forEach( neuron => {
                neuron.connectionWeight += neuron.light;
            });
            isSuccess = true;
        } else {
            this.brain.forEach( neuron => {
                neuron.connectionWeight -= neuron.light;
            });
            this.bias = receivedImageValue;
        }
        this.receivedImageValue = 0;
        return isSuccess;
    }
}