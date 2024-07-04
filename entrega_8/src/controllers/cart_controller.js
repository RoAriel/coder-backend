import { isValidObjectId } from 'mongoose';
import { v4 as uuidv4 } from "uuid"
import { cartService } from '../repository/cart.services.js';
import { productService } from '../repository/product.services.js';
import { ticketService } from '../repository/ticket.services.js';
import { CustomError } from '../utils/CustomError.js';
import { TIPOS_ERROR } from '../utils/EErrors.js';
import { errorCause } from '../utils/errorCause.js';

let errorName
const errorSiNoEsValidoID = (id, description) => {
    if (!(isValidObjectId(id))) {
        
        errorName = 'ObjectId no valido'
        return CustomError.createError(errorName,
            errorCause('addProductToCart', errorName, `${description} isValidObjectId: ${isValidObjectId(id)} - value: ${id}`),
            "Favor de corrigir el argumento", TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
    }
}

export const getCartByCid = async (req, res, next) => {
    let { cid } = req.params

    try {

        errorSiNoEsValidoID(cid, 'CID')

        let cart = await cartService.getCartPopulate(cid)

        if (cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(cart.products);
        } else {
            errorName = 'ID cart no existe'
            return CustomError.createError(errorName, errorCause('getCartByCid', errorName, `CID: ${cid} --> Cart: ${cart}`), "Ingrese carrito existente", TIPOS_ERROR.NOT_FOUND)
        }
    } catch (error) {
        return next(error)
    }
}

export const createCart = async (req, res, next) => {

    let productCart = req.body

    try {

        if (!productCart.hasOwnProperty('products')) {
            errorName = 'No hay lista de productos'
            CustomError.createError(errorName,
                errorCause('createCart',
                    errorName,
                    `body: ${JSON.stringify(productCart)}`),
                'Favor de corrigir el argumento',
                TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
        }

        if (typeof (productCart.products) != typeof ([])) {
            errorName = 'Products no es una lista'
            CustomError.createError(errorName,
                errorCause('createCart',
                    errorName,
                    `body: ${JSON.stringify(productCart)}`),
                'Favor de corrigir el argumento',
                TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
        }

        let cartNew = await cartService.createCart(productCart.products)

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ cartNew });

    } catch (error) {

        return next(error)
    }
}

export const addProductToCart = async (req, res, next) => {
    let { cid, pid } = req.params
    let existCart
    let existProduct

    try {


        //errorSiNoEsValidoID(cid, 'CID')
        //errorSiNoEsValidoID(pid, 'PID')


        //Controlo que existe el PID
        existProduct = await productService.getProductBy({ _id: pid })
        
        if (!existProduct) {
            errorName = 'No Existe Product'
            return next(CustomError.createError(errorName,
                errorCause('addProductToCart', errorName, error.message),
                error.message, TIPOS_ERROR.NOT_FOUND
            ))
        }

        //Controlo que existe el CID
        try {

            existCart = await cartService.getProductsByCartId(cid)
        } catch (error) {
            console.log('error', error);

            errorName = 'No Existe cart Cart'
            return CustomError.createError(errorName,
                errorCause('addProductToCart', errorName, error.message),
                error.message, TIPOS_ERROR.NOT_FOUND
            )
        }


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

        return next(error)
    }



}

export const removeProductFromCart = async (req, res, next) => {

    let { cid, pid } = req.params
    let cart
    let existProduct

    try {
        errorSiNoEsValidoID(cid, 'CID')
        errorSiNoEsValidoID(pid, 'PID')

        //Controlo que existe el CID
        try {
            cart = await cartService.getCartById(cid)
        } catch (error) {
            errorName = 'No Existe cart Cart'
            return CustomError.createError(errorName,
                errorCause('Add prodc', errorName, error.message),
                error.message, TIPOS_ERROR.NOT_FOUND
            )
        }


        //Controlo que existe el PID
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

        let cart_products = cart.products.filter(item => item.pid != pid)

        await cartService.addProductToCart(cid, cart_products)

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json('Carrito actializado');

    } catch (error) {
        return next(error)
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

    await ticketService.createTicket(ticket)
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: cartWithNoStock.map(prod => prod.id) });
}
