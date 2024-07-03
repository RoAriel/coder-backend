import { CartManagerMongo as CartDao } from '../dao/CartManager_mongo.js'
import { CustomError } from '../utils/CustomError.js'
import { TIPOS_ERROR } from '../utils/EErrors.js'
import { errorCause } from '../utils/errorCause.js'

let errorName

class CartService {

    constructor(dao) {
        this.dao = dao
    }

    getCarts = async (next) => {
        try {
            return await this.dao.getAll()
        } catch (error) {
            errorName = 'Error en getCarts'
            return next(CustomError.createError(errorName, errorCause('getCarts', errorName, error.message), error.message, TIPOS_ERROR.INTERNAL_SERVER_ERROR))
        }
    }

    getCartById = async (cid, next) => {
        try {
            return await this.dao.getById(cid)
        } catch (error) {
            errorName = 'Error en getCartById'
            return next(CustomError.createError(errorName, errorCause('getCartById', errorName, error.message), error.message, TIPOS_ERROR.INTERNAL_SERVER_ERROR))
        }
    }

    getProductsByCartId = async (cid, next) => {

        try {
            return (await this.getCartById(cid)).products
        } catch (error) {
            errorName = 'Error en getProductsByCartId'
            return next(CustomError.createError(errorName, errorCause('getProductsByCartId', errorName, error.message), error.message, TIPOS_ERROR.INTERNAL_SERVER_ERROR))
        }
    }

    createCart = async (products, next) => {
        try {
            return this.dao.create(products)
        } catch (error) {
            errorName = 'Error en createCart'
            return next(CustomError.createError(errorName, errorCause('createCart', errorName, error.message), error.message, TIPOS_ERROR.INTERNAL_SERVER_ERROR))
        }
    }

    addProductToCart = async (cid, products, next) => {
        try {
            return await this.dao.update(cid, products)
        } catch (error) {
            errorName = 'Error en addProductToCart'
            return next(CustomError.createError(errorName, errorCause('addProductToCart', errorName, error.message), error.message, TIPOS_ERROR.INTERNAL_SERVER_ERROR))
        }
    }

    getCartPopulate = async (cid, next) => {
        try {
            return this.dao.getOneByPopulate(cid)
        } catch (error) {
            errorName = 'Error en getCartPopulate'
            return next(CustomError.createError(errorName, errorCause('getCartPopulate', errorName, error.message), error.message, TIPOS_ERROR.INTERNAL_SERVER_ERROR))
        }
    }
}

export const cartService = new CartService(new CartDao)
