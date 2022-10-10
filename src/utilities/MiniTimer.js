"use strict";

/**
 *  Class pour avoir un timer pour le debug
 *
 */
class MiniTimer {
    constructor() {
        this.startTime = new Date();
        this.stopTime = this.startTime;
        this.count = 0;
    }

    restartTimer() {
        this.startTime = new Date();
        this.stopTime = this.startTime;
    }

    addCount() {
        this.count++;
    }

    restartCount() {
        this.count = 0;
    }

    stopTimer() {
        this.stopTime = new Date();
        //console.log(this.getTimeLocal(), 'count: ' + this.count);
    }

    getTimeMilliseconds() {
        return this.stopTime - this.startTime;
    }

    getTimeLocal() {
        let milliseconds = this.getTimeMilliseconds();
        let hours = Math.floor(milliseconds / 3600000);
        milliseconds -= hours * 3600000;
        let minutes = Math.floor(milliseconds / 60000);
        milliseconds -= minutes * 60000;
        let seconds = Math.floor(milliseconds / 1000);
        milliseconds -= seconds * 1000;
        return this.digits(hours, 2) + ':' + this.digits(minutes, 2) + ':' + this.digits(seconds, 2) + ',' + this.digits(milliseconds, 3);
    }

    digits(number, digits) {
        let text = '';
        for (let i = 0; i < digits; i++) {
            text += '0';
        }
        return (text + number).slice(-digits);
    }
}