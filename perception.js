export default class Perceptron {

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
            this.brain[index].light = (lightPoint*100)/255;
        });
    }

    guessWhatImageIs() {
        let isSuccess = false;
        this.brain.forEach( neuron => {
            this.receivedImageValue += neuron.light * neuron.connectionWeight;
        });
        if (this.receivedImageValue > this.realImage.value) {
            this.brain.forEach( neuron => {
                neuron.connectionWeight -= neuron.light;
            });
            isSuccess = true;
        } else {
            this.brain.forEach( neuron => {
                neuron.connectionWeight += neuron.light;
            });
            this.realImage.value = this.receivedImageValue;
        }
        this.receivedImageValue = 0;
        return isSuccess;
    }
}