import { Router } from "express";
import { ProductManagerMongo as ProductManager } from "../dao/ProductManager_mongo.js";
import { CartManagerMongo as CartManager } from "../dao/CartManager_mongo.js"
import { auth } from '../middleware/auth.js';

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
        let user = req.session.user
        
        cart = {_id: req.session.user.cart._id}
        
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
            payload, page, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage, prevLink, nextLink, cart, user
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
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).render("cart", { cart });
})

// LOGG

router.get('/',(req,res)=>{

    res.status(200).render('home', {login: req.session.user})
})

router.get('/registro',(req, res, next)=>{
    if(req.session.user){
        return res.redirect("/perfil")
    }

    next()
},(req,res)=>{
    let {error}=req.query

    res.status(200).render('registro', {error, login: req.session.user})
})

router.get('/login',(req, res, next)=>{
    if(req.session.user){
        return res.redirect("/perfil")
    }

    next()
}, (req,res)=>{

    let {error, mensaje}=req.query

    res.status(200).render('login', {error, mensaje, login: req.session.user})
})

router.get('/perfil', auth, (req,res)=>{

    res.status(200).render('perfil',{
        user:req.session.user, login: req.session.user
    })
})
