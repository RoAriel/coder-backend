import { Router } from 'express';
import {join} from 'node:path'
import __dirname from '../utils.js';
import ProductManager from '../dao/ProductManager.js';

export const router = Router()

const FILE_PATH = join(__dirname,'data','products.json')
let prMg = new ProductManager(FILE_PATH)

router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('home');
})

router.get('/realTimeproducts', async (req, res) => {

    let products = await prMg.getProducts();
    try {

        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('realTimeProducts', { products});

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
