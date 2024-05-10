import { Router } from "express";
import { ProductManagerMongo as ProductManager } from "../dao/ProductManager_mongo.js";

export const router = Router()

const pm = new ProductManager

router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('home');
})

router.get('/productos', async (req, res) => {

    let { limit, pagina, query, sort } = req.query
    if (!pagina) pagina = 1

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
        payload, page, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage, prevLink, nextLink
    })

})
