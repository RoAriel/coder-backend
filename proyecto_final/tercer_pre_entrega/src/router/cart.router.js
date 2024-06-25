import { Router } from 'express';
import { passportCall } from '../utils.js'
import { auth } from '../middleware/auth.js';
import { getCartByCid, createCart, addProductToCart, removeProductFromCart, changeProductsfromCart, updateQuantityOfProduct, deleteCartProducts, purchase} from '../controllers/cart_controller.js';

export const router = Router()

router.get('/:cid', getCartByCid)

router.post('/', createCart)

router.post('/:cid/products/:pid', passportCall('current'), auth(['user']), addProductToCart)

router.delete('/:cid/products/:pid', passportCall('current'), removeProductFromCart)

router.put('/:cid', passportCall('current'), auth(['user']), changeProductsfromCart)

router.put('/:cid/products/:pid', passportCall('current'), updateQuantityOfProduct)

router.delete('/:cid', deleteCartProducts)

router.post('/:cid/purchase',passportCall('current'), purchase)
