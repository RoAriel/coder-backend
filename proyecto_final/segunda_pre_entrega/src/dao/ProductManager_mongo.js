import { productModel } from './models/product.model.js'

export class ProductManagerMongo {

    async getProducts() {
        return await productModel.find()
    }

    async getProductBy(filtro) {
        return await productModel.findOne(filtro)
    }

    async getAllPaginate(limit = 10, page = 1, query, sort) {

        let orden = sort == 'desc' ? -1 : 1

        let options = {
            limit,
            page,
            lean: true,
            sort: { price: orden }
        }

        let filter = query ? { category: query } : {}

        let ret
        try {
            let { docs: payload, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage } = await productModel.paginate(filter, options)

            ret = {
                status: 'success',
                payload,
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: null,
                nextLink: null
            }
        } catch (error) {

            ret = {
                status: 'error',
                docs: `${error.message}`
            }
        }

        return ret
    }

    async addProduct(product) {

        return await productModel.create(product)
    }

    async deleteProduct(productId) {

        return await productModel.deleteOne({ _id: productId })
    }

    async updtadeProduct(id, product) {
        return await productModel.findByIdAndUpdate(id, product, { runValidators: true, returnDocument: "after" })
    }
}