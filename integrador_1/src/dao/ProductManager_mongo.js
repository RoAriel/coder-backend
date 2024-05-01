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
}