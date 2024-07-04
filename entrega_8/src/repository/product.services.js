import { ProductManagerMongo as ProductDao } from '../dao/ProductManager_mongo.js'
import { CustomError } from '../utils/CustomError.js'
import { errorCause } from '../utils/errorCause.js'
import { TIPOS_ERROR } from '../utils/EErrors.js'
let errorName

class ProductService {
    constructor(dao) {
        this.dao = dao
    }

    getProducts = async () => {
        return await this.dao.get()
    }

    getProductBy = async (filter) => {
        try {

            return await this.dao.getBy(filter)
        } catch (error) {
            errorName = 'Error en getProductBy'
            return CustomError.createError(errorName, errorCause('getProductBy', errorName, error.message), error.message, TIPOS_ERROR.INTERNAL_SERVER_ERROR)
        }
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