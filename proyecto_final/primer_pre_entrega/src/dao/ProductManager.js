import fs from "node:fs"

export default class ProductManager{

    static maxId = 0;

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

        if (!title || !description || !price || !thumbnail || !code || !stock || !category)
            return 'Todos los campos son requeridos, compruebe que todos los campos esten.';

        let productos_db = await this.getProducts();

        let existCode = productos_db.some(p => p.code == code);

        if (existCode) {
            return `El codigo: ${code}, ya existe para otro producto.`;
        } else {
            
            let maxIdProducts = Math.max(...productos_db.map(p => p.id));
            let id = Math.max(ProductManager.maxId,maxIdProducts) + 1;

            prd = {
                id: id,
                title: title,
                description: description,
                code: code,
                price: price,
                status: true,
                stock: stock,
                category: category,
                thumbnail: [thumbnail]
                
            };
            
            ProductManager.maxId = id;
        };

        productos_db.push(prd);
        await fs.promises.writeFile(this.pathFile, JSON.stringify(productos_db));


        return `Producto agregado. ID: ${id}`;

    };

    async getProductById(id) {
        let productos_db = await this.getProducts();

        let prd = productos_db.find(p => p.id == id);

        if (prd) {
            return prd;
        } else {
            return `Producto no encontrado con el id: ${id}`;
        }

    };

    async updateProduct(id, campo, nuevoValor) {

        if (campo == "id") { return "No puede modificar este atributo" }

        let prd = await this.getProductById(id)

        let productos_db = (await this.getProducts()).filter(p => p.id != id);


        if (prd[`${campo}`]) {

            prd[`${campo}`] = nuevoValor;

            productos_db.push(prd);

            await fs.promises.writeFile(this.pathFile, JSON.stringify(productos_db));

            return (`Update completo al producto ID: ${id}`);

        } else { return "No se encontro artibuto" };
    };

    async deleteProduct(id) {

        let productos_db = await this.getProducts();
        let existCode = productos_db.some(p => p.id == id);

        if (existCode) {

            let newProductos_db = (await this.getProducts()).filter(p => p.id != id);
            await fs.promises.writeFile(this.pathFile, JSON.stringify(newProductos_db));
            return "Peroducto eliminado."
        } else {
            return "Producto Id no encontrado."
        }
    };
};
