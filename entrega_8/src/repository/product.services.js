import { ProductManagerMongo as ProductDao } from '../dao/ProductManager_mongo.js'

class ProductService {
    constructor(dao) {
        this.dao = dao
    }

    getProducts = async () => {
        return await this.dao.get()
    }

    getProductBy = async (filter) => {
        return await this.dao.getBy(filter)
    }

    getProductsPaginate = async (limit, page, query, sort) => {
        return await this.dao.getAllPaginate(limit, page, query, sort)
    }

    addProduct = async (product) => {
        return await this.dao.create(product)
    }

    deleteProduct = async (pid) => {
        return await this.dao.delete(pid)
    }

    updtadeProduct = async (pid, product) => {
        return await this.dao.update(pid,product)
    }
}

export const productService = new ProductService(new ProductDao)