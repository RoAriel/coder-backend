import { Router } from 'express';
import { ProductManagerMongo as ProductManager } from '../dao/ProductManager_mongo.js';
import { isValidObjectId } from 'mongoose';

const pm = new ProductManager

export const router = Router()

router.get('/', async (req, res) => {

    try {
        let proucts = await pm.getProducts()
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ proucts });
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

router.get('/:id', async (req, res) => {
    let {id} = req.params

    if (!isValidObjectId(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Favor ingrese un ID valido.`})
    }

    try {
        let prd = await pm.getProductBy({_id : id})
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({prd});
    } catch (error) {
        console.log('error', error);
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
        
        
    }
})

router.post('/', async (req, res) => {

    let { title, description, code, price, status, stock, category, thumbnail } = req.body

    if (!title, !description, !code, !price, !stock, !category, !thumbnail) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Faltan datos obligatorios` })
    }

    let prExist

    try {
        prExist = await pm.getProductBy({ code })
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )

    }

    if (prExist) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El producto con codigo ${code} ya existe.` })
    }

    // valido que status venga con contenido, de no ser así pongo True
    (status == null) ? status = true : status

    try {
        let prd = { title, description, code, price, status, stock, category, thumbnail }
        let newProduct = await pm.addProduct(prd)
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ payload: newProduct });
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