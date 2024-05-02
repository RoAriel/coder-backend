import { Router } from "express";
import __dirname from "../utils.js";
import { ProductManagerMongo as ProductManager } from "../dao/ProductManager_mongo.js";

export const router = Router()

let pm = new ProductManager

router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('home');
})

router.get('/realTimeproducts', async (req, res) => {

    let products
    
    try {
        products = await pm.getProducts();
        console.log('products:', products);
        
        res.setHeader('Content-Type', 'text/html');      
        res.status(200).render('realTimeProducts', {products});

    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            }
        )
    }
})

router.get('/chat',(req,res)=>{
    res.status(200).render('chat')
})