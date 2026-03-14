export class Random {

    static range(min, max) {
        return Math.random() * (max - min) + min;
    }

    static int(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}