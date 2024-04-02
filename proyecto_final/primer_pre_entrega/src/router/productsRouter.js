import { Router } from 'express';
import {join} from 'node:path'
import __dirname from '../utils.js';
import ProductManager from '../dao/ProductManager.js';

export const router=Router()

const FILE_PATH = join(__dirname,'data','products.json')

const pm = new ProductManager(FILE_PATH)

router.get("/", async(req, res)=>{

    let limit = Number(req.query.limit); 

    let products=await pm.getProducts()
    if(limit){
        products=products.slice(0, limit)
    }

    res.json(products)

})

router.get("/:pid", async(req, res)=>{

    let pid=Number(req.params.pid)

    if(isNaN(pid)){
        return res.json({error:`Ingrese un id numérico...!!!`})
    }

    try {
        let product=await pm.getProductById(pid)
        if(!product){
            return res.json({message:`No existen producto con id ${pid}`})
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

    if (!title || !description || !price || !thumbnail || !code || !stock || !category){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Complete los campos que son requeridos`})
    }

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

router.put("/:pid", async(req, res)=>{

    let {propiedad, nuevoValor} = req.body

    let pid=req.params.pid
    
    pid=Number(pid)
    if(isNaN(pid)){
        return res.json({error:`Ingrese un id numérico...!!!`})
    }


    try {
        
        let prodModificado=await pm.updateProduct(pid, propiedad, nuevoValor)
        res.setHeader('Content-Type','application/json');
        return res.status(200).json(prodModificado);
    
    } catch (error) {
       
        console.log(error)
        return res.json({error:"Error desconocido...!!!"})
    }

})


router.delete("/:pid", async(req, res)=>{

    let pid=req.params.pid
    pid=Number(pid)
    if(isNaN(pid)){
        return res.json({error:`Ingrese un id numérico...!!!`})
    }

    try {
        let prAEliminar=await pm.deleteProduct(pid)
        res.setHeader('Content-Type','application/json');
        return res.status(200).json(prAEliminar);
    
    } catch (error) {
        console.log(error)
        return res.json({error:"Error desconocido...!!!"})
    }



})
