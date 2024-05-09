import { cartModel } from './models/cart.model.js'

export class CartManagerMongo {

    async getCarts(){
        return await cartModel.find()
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


}