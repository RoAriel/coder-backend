import { CartManagerMongo as CartDao } from '../dao/CartManager_mongo.js'


class CartService {

    constructor(dao) {
        this.dao = dao
    }

    getCarts = async () => {
        return await this.dao.getAll()
    }

    getCartById = async (cid) => {
        return await this.dao.getById(cid)
    }

    getProductsByCartId = async (cid) => {
        return (await this.getCartById(cid)).products
    }

    createCart = async (products) => {
        return this.dao.create(products)
    }

    addProductToCart = async (cid, products) => {
        return await this.dao.update(cid, products)
    }

    getCartPopulate = async (cid) => {
        return this.dao.getOneByPopulate(cid)
    }
}

export const cartService = new CartService(new CartDao)
