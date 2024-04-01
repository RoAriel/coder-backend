import fs from 'node:fs';
import ProductManager from './ProductManager.js';

export default class CartManager {

    constructor(pathFile, producManager) {
        this.pathFile = pathFile
        this.producManager = producManager
    }

    async getCarts() {

        if (fs.existsSync(this.pathFile)) {
            return JSON.parse(await fs.promises.readFile(this.pathFile, { encoding: "utf-8" }));

        } else {
            return [];
        };
    }

    async getProductByCartId(cid) {
        let carts_bd = await this.getCarts();
        let bd_products = await this.producManager.getProducts()

        let cart = carts_bd.find(p => p.cid == cid);

        if (cart) {

            let { products } = cart

            let idProducts = products.map(p => p["pid"])
            let productsName = []

            idProducts.forEach(id => {
                bd_products.forEach(p => {
                    if (p["id"] == id) productsName.push(p["title"])
                })
            })

            return productsName;
        } else {
            return `Producto no encontrado con el id: ${cid}`;
        }

    };
    async addCart(listProducts) {

        let bd_carts = await this.getCarts() // para ver el ID

        let maxCartID = Math.max(...(bd_carts.map(c => c.cid))) // Obtengo el maxID (esto si es por si el  carts.json esta inicializado)

        let bd_idProducts = (await this.producManager.getProducts()).map(pr => pr.id)// para controlar que el pr exista

        let pIds = listProducts.map(pr => pr.pid) // obtengo los pids de los productos a agregar

        if (pIds.every(id => bd_idProducts.includes(id))) {

            let newID = maxCartID + 1
            let cart = {
                cid: newID,
                products: listProducts
            }

            bd_carts.push(cart);
            await fs.promises.writeFile(this.pathFile, JSON.stringify(bd_carts));
            return `Carrito agregado. ID: ${maxCartID}`;

        } else {
            return 'Producto/s no encontrado/s en la DB de productos'
        }

    }
}