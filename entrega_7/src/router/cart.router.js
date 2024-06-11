import { Router } from 'express';
import { passportCall } from '../utils.js'
import { getCartByCid, createCart, addProductToCart, removeProductFromCart, changeProductsfromCart, updateQuantityOfProduct, deleteCartProducts} from '../controllers/cart_controller.js';

export const router = Router()

router.get('/:cid', getCartByCid)

router.post('/', createCart)

router.post('/:cid/products/:pid', passportCall('current'), addProductToCart)

router.delete('/:cid/products/:pid', passportCall('current'), removeProductFromCart)

router.put('/:cid', passportCall('current'), changeProductsfromCart)

router.put('/:cid/products/:pid', passportCall('current'), updateQuantityOfProduct)

router.delete('/:cid', deleteCartProducts)
