import { Router } from "express";
import { ProductManagerMongo as ProductManager } from "../dao/ProductManager_mongo.js";
import { CartManagerMongo as CartManager } from "../dao/CartManager_mongo.js"

export const router = Router()

const pm = new ProductManager
const cm = new CartManager

router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('home');
})

router.get('/productos', async (req, res) => {

    let cart
    let { limit, pagina, query, sort } = req.query
    if (!pagina) pagina = 1

    try {
        cart = await cm.getOneBy()
        if (!cart) {
            cart = await cm.addProduct([])
        }
        let {
            payload,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        } = await pm.getAllPaginate(limit, pagina, query, sort)

        res.setHeader('Content-Type', 'text/html')
        res.status(200).render("products", {
            payload, page, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage, prevLink, nextLink, cart
        })

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

router.get('/carrito/:cid', async (req, res) => {

    let { cid } = req.params

    let cart = await cm.getOneByPopulate(cid)
console.log('my_cart:', cart)
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).render("cart",  {cart});
})
