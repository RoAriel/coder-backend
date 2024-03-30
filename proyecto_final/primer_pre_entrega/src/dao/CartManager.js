import fs from 'node:fs';

export default class CartManager{

    static maxCartID = 0;

    constructor(pathFile) {
        this.pathFile = pathFile
    }
}