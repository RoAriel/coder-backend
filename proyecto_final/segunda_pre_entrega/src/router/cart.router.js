import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { CartManagerMongo as CartManager } from '../dao/CartManager_mongo.js'
import { ProductManagerMongo as ProductManager } from '../dao/ProductManager_mongo.js'

export const router = Router()

const cm = new CartManager
const pm = new ProductManager

router.get('/:cid', async (req, res) => {

    let { cid } = req.params

    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Favor ingrese un ID valido.` })
    }
    try {
        let cart = await cm.getProductsByCartId(cid)

        if (cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(cart.products);
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Cart ID no existe` })
        }
    } catch (error) {
        console.log('Error:', error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
})

router.post('/', async (req, res) => {

    let products = req.body

    if (!products) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Complete los campos que son requeridos` })
    }

    // TODO: Validacion de que los pid sean ObjectId

    try {
        let cartNew = await cm.addCart(products)

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ cartNew });

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

router.post('/:cid/products/:pid', async (req, res) => {
    let { cid, pid } = req.params

    if (!isValidObjectId(cid) && !isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Favor ingrese un ID valido.` })
    }

    //Controlo que existe el CID
    let existCart
    try {
        existCart = await cm.getProductsByCartId(cid)
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )

    }

    //Controlo que existe el PID
    let existProduct
    try {
        existProduct = await pm.getProductBy({ _id: pid })
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )

    }

    if (!existCart && !existProduct) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Ingrese ID's validos para la operacion` })
    }

    try {

        let productsInCart = (await cm.getProductsByCartId(cid)).products

        if ((productsInCart.map(pr => (pr.pid).toString())).includes(pid)) {

            productsInCart.forEach(pr => { if ((pr.pid).toString() == pid) pr.quantity++ })

            await cm.addProductToCart(cid, productsInCart)
            
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(`Se agrego el producto al Cart+1`);
            
        } else {

            productsInCart.push({ pid: pid, quantity: 1 })

            await cm.addProductToCart(cid, productsInCart)

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(`Se agrego el producto al Cart`);
        }

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