import { Router } from 'express';
import { join } from 'node:path'
import __dirname from '../utils.js';
import CartManager from '../dao/CartManager.js';
import ProductManager from '../dao/ProductManager.js';

export const router = Router()

const FILE_PATH = join(__dirname, 'data', 'carts.json')
const FILE_PATH_PRODUCTS = join(__dirname, 'data', 'products.json')

const pm = new ProductManager(FILE_PATH_PRODUCTS)
const cm = new CartManager(FILE_PATH, pm)

router.get("/:cid", async (req, res) => {

    let cid = Number(req.params.cid)
    

    if (isNaN(cid)) {
        return res.json({ error: `Ingrese un id numérico...!!!` })
    }

    try {
        let cart = await cm.getProductByCartId(cid)
        if(!cart){
            return res.json({message:`No existen Carrito con id ${cid}`})
        }
        return res.json(cart)
    } catch (error) {
        console.log(error)
        return res.json({error:"Error desconocido...!!!"})
    
    }
})



router.post("/", async (req, res) => {

    let { products } = req.body

    if (!products) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Complete los campos que son requeridos` })
    }

    try {

        let newCart = await cm.addCart(products)

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(newCart);

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