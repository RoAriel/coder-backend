import { Router } from 'express';
import {join} from 'node:path'
import __dirname from '../utils.js';
import ProductManager from '../dao/ProductManager.js';
import { randomBytes } from 'node:crypto';

export const router=Router()

const FILE_PATH = join(__dirname,'data','products.json')

const pm = new ProductManager(FILE_PATH)

router.get("/", async(req, res)=>{

    let {limit, skip, nombre}=req.query

    console.log(skip, nombre)

    let products=await pm.getProducts()
    if(limit){
        products=usuarios.slice(0, limit)
    }

    res.json(products)

})

router.get("/:id", async(req, res)=>{

    let id=req.params.id

    id=Number(id)  // "100"
    if(isNaN(id)){
        return res.json({error:`Ingrese un id numérico...!!!`})
    }

    try {
        let product=await pm.getProductById(id)
        if(!product){
            return res.json({message:`No existen producto con id ${id}`})
        }
    
        return res.json(product)
    } catch (error) {
        console.log(error)
        return res.json({error:"Error desconocido...!!!"})
    }
});

router.post("/", async(req, res)=>{
    let {title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail
    } = req.body
    // validacion
    if (!title || !description || !price || !thumbnail || !code || !stock || !category){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Complete los campos que son requeridos`})
    }

    // resto validaciones 
    try {
        let nuevoProd=await pm.addProduct(title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail) 

        res.setHeader('Content-Type','application/json');
        return res.status(200).json(nuevoProd);

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