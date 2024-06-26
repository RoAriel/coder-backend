import { isValidObjectId } from 'mongoose';
import { ProductManagerMongo as ProductManager } from '../dao/ProductManager_mongo.js'
import { TicketManagerMongo as TicketManager } from '../dao/TicketManager_mongo.js';
import { v4 as uuidv4 } from "uuid"
import { cartService } from '../repository/cart.services.js';
import { productService } from '../repository/product.services.js';

const productManager = new ProductManager
const ticketManager = new TicketManager

export const getCartByCid = async (req, res) => {

    let { cid } = req.params

    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Favor ingrese un ID valido.` })
    }
    try {
        let cart = await cartService.getCartPopulate(cid)

        if (cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(cart.products);
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Cart ID no existe` })
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
}

export const createCart = async (req, res) => {

    let products = req.body

    if (!products) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Complete los campos que son requeridos` })
    }

    try {
        let cartNew = await cartService.createCart(products)

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
}

export const addProductToCart = async (req, res) => {
    let { cid, pid } = req.params

    if (!isValidObjectId(cid) && !isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Favor ingrese un ID valido.` })
    }

    //Controlo que existe el CID
    let existCart
    try {
        existCart = await cartService.getProductsByCartId(cid)
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
        existProduct = await productService.getProductBy({ _id: pid })
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

        let productsInCart = await cartService.getProductsByCartId(cid)

        if ((productsInCart.map(pr => (pr.pid).toString())).includes(pid)) {

            productsInCart.forEach(pr => { if ((pr.pid).toString() == pid) pr.quantity++ })

            await cartService.addProductToCart(cid, productsInCart)

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(`El producto ${existProduct.title} ya existia, se agrega una unidad más`);

        } else {

            productsInCart.push({ pid: pid, quantity: 1 })

            await cartService.addProductToCart(cid, productsInCart)

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(`Se agrego el producto ${existProduct.title} al Cart`);
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
}

export const removeProductFromCart = async (req, res) => {

    let { cid, pid } = req.params

    if (!isValidObjectId(cid) && !isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Favor ingrese un ID valido.` })
    }

    //Controlo que existe el CID
    let cart
    try {
        cart = await cartService.getCartById(cid)
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
        existProduct = await productService.getProductBy({ _id: pid })
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }

    if (!cart && !existProduct) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Ingrese ID's validos para la operacion` })
    }

    try {

        let cart_products = cart.products.filter(item => item.pid != pid)

        await cartService.addProductToCart(cid, cart_products)

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json('Carrito actializado');

    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
}

export const changeProductsfromCart = async (req, res) => {

    let { cid } = req.params
    let prods = req.body.products

    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Favor ingrese un ID valido.` })
    }

    //Controlo que existe el CID
    let cart
    try {
        cart = await cartService.getCartById(cid)
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )

    }

    if (!cart) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Ingrese ID's valido para la operacion` })
    }

    // Controlo que los productos que llegan al body sean existan
    try {
        let products = await productService.getProducts()
        let existenProductos = prods.every(e => (products.map(pr => (pr._id).toString())).includes(e.pid))

        if (!existenProductos) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Uno o mas productos no existe` })
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

    // Cargo los nuevos productos
    try {
        await cartService.addProductToCart(cid, prods)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json('Se agregan productos');
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )

    }

}

export const updateQuantityOfProduct = async (req, res) => {

    let { cid, pid } = req.params
    let cantidad = Number(req.body.quantity)

    let isNAN = isNaN(cantidad)
    if (isNAN || cantidad <= 0) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Quantity no valido.` })
    }

    if (!isValidObjectId(cid) && !isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Favor ingrese un ID valido.` })
    }

    //Controlo que existe el CID
    let cart
    try {
        cart = await cartService.getCartById(cid)
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
    let product
    try {
        product = await productService.getProductBy({ _id: pid })

    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )

    }

    if (!cart && !product) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Ingrese ID's validos para la operacion` })
    }

    let products = cart.products
    let indiceProducto = cart.products.findIndex(p => p.pid.toString() == product._id.toString())

    if (!products[indiceProducto]) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El producto no existe en el carrito.` })
    } else {
        products[indiceProducto].quantity = cantidad
    }
    try {
        await cartService.addProductToCart(cid, products)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(`Update quantity del Producto ${pid}`);
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )

    }
}

export const deleteCartProducts = async (req, res) => {

    let { cid } = req.params

    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Favor ingrese un ID valido.` })
    }

    //Controlo que existe el CID
    let cart
    try {
        cart = await cartService.getCartById(cid)
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )

    }

    if (!cart) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Ingrese ID's valido para la operacion` })
    }

    try {

        await cartService.addProductToCart(cid, [])
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(`Carrido de CID ${cid}, fue vaciado.`);
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )

    }
}

export const purchase = async (req, res) => {

    let { cid } = req.params
    let user = req.user
    let cart
    let cartWithNoStock = []
    let amount = 0
    try {
        cart = await cartService.getCartById(cid)
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
    if (!cart) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Ingrese ID's valido para la operacion` })
    }

    for (const product of cart.products) {
        let prd = await productService.getProductBy({ _id: product.pid })

        if (product.quantity < prd.stock) {

            await productService.updtadeProduct(prd._id, { stock: prd.stock - product.quantity })
            amount = amount + (product.quantity * prd.price)

        } else {
            cartWithNoStock.push(product)
        }

    }

    if (cartWithNoStock.length > 0) {
        await cartService.addProductToCart(cid, cartWithNoStock)
    } else {
        await cartService.addProductToCart(cid, [])

    }

    let ticket = {
        code: uuidv4(),
        purchase_datetime: new Date(),
        amount: amount,
        purchaser: user.email,
    }

    ticketManager.create(ticket)
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: cartWithNoStock.map(prod => prod.id) });
}
