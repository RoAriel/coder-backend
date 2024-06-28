import { ProductManagerMongo as ProductManager } from '../dao/ProductManager_mongo.js';
import { isValidObjectId } from 'mongoose';
import { productService } from '../repository/product.services.js';

export const getAllProducts = async (req, res) => {

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

        pages_products = await productService.getProductsPaginate(limit, page, qry, sort)

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
}

export const getProductByPid = async (req, res) => {
    let { pid } = req.params

    if (!isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Favor ingrese un ID valido.` })
    }

    try {
        let product = await productService.getProductBy({ _id: pid })
        if (product) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ product });
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
}

export const createNewProduct = async (req, res) => {

    let { title, description, code, price, status, stock, category, thumbnail } = req.body

    if (!title, !description, !code, !price, !stock, !category, !thumbnail) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Faltan datos obligatorios` })
    }

    let prExist

    try {
        prExist = await productService.getProductBy({ code })
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
        let newProduct = await productService.addProduct(prd)

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

}

export const updateProduct = async (req, res) => {
    let { pid } = req.params
    if (!isValidObjectId(pid)) {
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
            exists = await productService.getProductBy({ _id: { $ne: pid }, code: prdUpd.code })
            if (exists) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Ya existe otro producto con el nro de codigo ingresado` })
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
    try {

        let prodUpdated = await productService.updtadeProduct(pid, prdUpd)
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

}

export const deleteProduct = async (req, res) => {
    let { pid } = req.params

    if (!isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Favor ingrese un ID valido.` })
    }

    let prExist

    try {
        prExist = await productService.getProductBy({ _id: pid })

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
        return res.status(400).json({ error: `Producto con ID ${pid} no existe.` })
    }

    try {
        let prDel = await productService.deleteProduct(pid)

        if (prDel.deletedCount > 0) {

            let products = await productService.getProducts()
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: `Producto ${prExist.title} eliminado` });
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: `No existen producto con id ${pid} / o error al eliminar` })
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