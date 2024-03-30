import fs from 'node:fs';

export default class CartManager{

    static maxCartID = 0;

    constructor(pathFile) {
        this.pathFile = pathFile
    }

    async getCarts() {

        if (fs.existsSync(this.pathFile)) {
            return JSON.parse(await fs.promises.readFile(this.pathFile, { encoding: "utf-8" }));

        } else {
            return [];
        };
    }

    
}