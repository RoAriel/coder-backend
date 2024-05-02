import { cartModel } from './models/cart.model.js'

export class CartManager_mongo {

    async getCarts(){
        return await cartModel.find()
    }

    async getProductsByCartId(cid){

        return await cartModel.findById({_id : cid})
    }

    async addCart(listProducts){
        return cartModel.create(listProducts)
    }

    // async addProductToCart(cid, product){
    //     return
    // }


}