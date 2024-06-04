import { Router } from 'express';
import { ProductManagerMongo as ProductManager } from '../dao/ProductManager_mongo.js';
import { isValidObjectId } from 'mongoose';
import { auth } from '../middleware/auth.js';
import {passportCall} from '../utils.js'

export const router = Router()

const pm = new ProductManager

router.get('/', passportCall('current'),async (req, res) => {

    let pages_products
    let d0, d1, d2, d3 = {}, clave, val, qry = {} // variables necesarias para generar el qry de filtro
    let { limit, page, query, sort, category } = req.query

    if (query) {
        
        let str = query.slice(1, -1)
        
        let datos = str.split(':')

        if (datos.length > 2) {

            d0 = datos[0]
            d1 = datos[1].slice(1)
            d2 = datos[2].slice(0, -1)
            d3[d1] = d2
            qry[d0] = d3

        } else {

            clave = datos[0]
            val = datos[1].slice(1, -1)
            qry[clave] = val

        }
    }
    
    try {

        pages_products = await pm.getAllPaginate(limit, page, qry, sort)

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(pages_products);

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
    let { id } = req.params

    if (!isValidObjectId(id)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Favor ingrese un ID valido.` })
    }

    try {
        let prd = await pm.getProductBy({ _id: id })
        if (prd) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ prd });
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Producto no encontrado` })
        }
    } catch (error) {
        console.log('error', error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )


    }
})


router.post('/', passportCall('current'),async (req, res) => {

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

router.delete('/:id', async (req, res) => {
    let { id } = req.params

    if (!isValidObjectId(id)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Favor ingrese un ID valido.` })
    }

    let prExist

    try {
        prExist = await pm.getProductBy({ _id: id })

    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )

    }

    if (!prExist) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Producto con ID ${id} no existe.` })
    }

    try {
        let prDel = await pm.deleteProduct(id)

        if (prDel.deletedCount > 0) {

            let products = await pm.getProducts()
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: `Producto con id ${id} eliminado` });
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: `No existen producto con id ${id} / o error al eliminar` })
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

router.put('/:id', passportCall('current'),async (req, res) => {
    let { id } = req.params
    if (!isValidObjectId(id)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Favor ingrese un ID valido.` })
    }

    let prdUpd = req.body

    if (prdUpd._id) {
        delete prdUpd._id
    }

    if (prdUpd.code) {
        let exists
        try {
            exists = await pm.getProductBy({ _id: { $ne: id }, code: prdUpd.code })
            if (exists) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Ya existe otro producto con el nro de codigo ingresado` })
            }
        } catch (error) {

        }
    }
    try {
        let prodUpdated = await pm.updtadeProduct(id, prdUpd)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ prodUpdated });
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