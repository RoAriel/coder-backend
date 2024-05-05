import { productModel } from './models/product.model.js'

export class ProductManagerMongo{

    async getProducts(){
        return await productModel.find()
    }

    async getProductBy(filtro){
        return await productModel.findOne(filtro)
    }

    async addProduct(product){
        
        return await productModel.create(product)
    }

    async deleteProduct(productId){

        return await productModel.deleteOne({ _id : productId})
    }

    async updtadeProduct(id, product){
        return await productModel.findByIdAndUpdate(id, product, {runValidators: true, returnDocument: "after"})
    }
}