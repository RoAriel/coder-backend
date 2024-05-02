import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { CartManager_mongo as CartManager} from '../dao/CartManager_mongo.js'

export const router = Router()

const cm = new CartManager

router.get('/', async (req, res) => {

    try {
        let carts = await cm.getCarts()
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ carts });
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

        res.setHeader('Content-Type','application/json');
        return res.status(200).json({cartNew});

    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
        
    }
})