const fs = require('node:fs');

class ProductManager {
    static nxtProductId = 0;

    constructor(pathFile) {
        this.pathFile = pathFile
    }

    async getProducts() {

        if (fs.existsSync(this.pathFile)) {
            return JSON.parse(await fs.promises.readFile(this.pathFile, { encoding: "utf-8" }));

        } else {
            return [];
        };
    }

    async addProduct(title, description, price, thumbnail, code, stock) {

        let prd;
        let id;

        if (!title || !description || !price || !thumbnail || !code || !stock)
            return 'Todos los campos son requeridos, compruebe que todos los campos esten.';

        let productos_db = await this.getProducts();

        let existCode = productos_db.some(p => p.code == code);

        if (existCode) {
            return `El codigo: ${code}, ya existe para otro producto.`;
        } else {

            id = ProductManager.nxtProductId;
            prd = {
                id: id,
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock
            };
        };

        productos_db.push(prd);
        await fs.promises.writeFile(this.pathFile, JSON.stringify(productos_db));

        ProductManager.nxtProductId++;

        return `Producto agregado. ID: ${id}`;

    };

    async getProductById(id){
        let productos_db = await this.getProducts();

        let prd = productos_db.find(p => p.id == id);

        if (prd){
            return prd;
        }else{
            return `Producto no encontrado con el id: ${id}`;
        }

    };
}

module.exports = ProductManager;