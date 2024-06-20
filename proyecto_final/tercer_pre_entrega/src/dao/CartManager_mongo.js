import { cartModel } from './models/cart.model.js'

export class CartManagerMongo {

    async getCarts(){
        return await cartModel.find()
    }

    async getOneBy(filtro={}){
        return await cartModel.findOne(filtro).lean()
    }

    async getCart(cid){
        return await cartModel.findById({_id : cid})
    }
    async getProductsByCartId(cid){

        return (await cartModel.findById({_id : cid})).products
    }

    async addCart(listProducts){
        return cartModel.create(listProducts)
    }

    async addProductToCart(cid, products){
        return cartModel.updateOne({_id : cid}, {$set: {products: products}})
    }

    async getOneByPopulate(cid){
        return await cartModel.findOne({_id : cid}).populate("products.pid")//.lean()
    }

    async create(){
        let cart=await cartModel.create({productos:[]})
        return cart.toJSON()
    }
}