import { Router } from 'express';
import { join } from 'node:path'
import __dirname from '../utils.js';
import ProductManager from '../dao/ProductManager.js';

export const router = Router()

const FILE_PATH = join(__dirname, 'data', 'products.json')

const pm = new ProductManager(FILE_PATH)

router.get("/", async (req, res) => {

    let products

    try {
        products = await pm.getProducts()

    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            }
        )
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ products });


})


router.post("/", async (req, res) => {

    let nuevoProd
    let { title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail
    } = req.body

    if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Complete los campos que son requeridos` })
    }

    try {
        nuevoProd = await pm.addProduct(title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail)

        req.serverSocket.emit("nuevoProducto", title)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(nuevoProd);

    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )

    }
})

router.put("/:pid", async (req, res) => {

    let { propiedad, nuevoValor } = req.body

    let pid = req.params.pid

    pid = Number(pid)
    if (isNaN(pid)) {
        return res.json({ error: `Ingrese un id numérico...!!!` })
    }


    try {

        let prodModificado = await pm.updateProduct(pid, propiedad, nuevoValor)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(prodModificado);

    } catch (error) {

        console.log(error)
        return res.json({ error: "Error desconocido...!!!" })
    }

})


router.delete("/:pid", async (req, res) => {

    let prAEliminar
    let products
    let pid = req.params.pid
    pid = Number(pid)
    if (isNaN(pid)) {
        return res.status(400).json({ error: `Ingrese un id numérico...!!!` })
    }

    try {

        prAEliminar = await pm.deleteProduct(pid)
        products = await pm.getProducts()

        res.setHeader('Content-Type', 'application/json');

        req.serverSocket.emit("productos", products)
        return res.status(200).json(prAEliminar);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error desconocido...!!!" })
    }



})
