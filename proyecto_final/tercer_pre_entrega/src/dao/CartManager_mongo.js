import { cartModel } from './models/cart.model.js'

export class CartManagerMongo {

    async getAll(){
        return await cartModel.find()
    }

    async getOneBy(filtro={}){
        return await cartModel.findOne(filtro).lean()
    }

    async getById(id){
        return await cartModel.findById({_id : id})
    }

    async create(list){
        return await cartModel.create(list)
    }

    async update(id, list){
        return await cartModel.updateOne({_id : id}, {$set: {products: list}})
    }

    async getOneByPopulate(id){
        return await cartModel.findOne({_id : id}).populate("products.pid")//.lean()
    }

}