import { Router } from 'express';
import {join} from 'node:path'
import __dirname from '../utils.js';
import  CartManager from '../dao/CartManager.js';

export const router=Router()

const FILE_PATH = join(__dirname,'data','carts.json')

const cm = new CartManager(FILE_PATH)

router.get("/", async(req,res) =>{

    let limit = Number(req.query.limit); 

    let isNAN = isNaN(limit)
    let carts= await cm.getCarts()
    console.log(limit);
    
    if(!isNAN && limit>0){
        carts=carts.slice(0, limit)
    }

    res.json(carts)

})