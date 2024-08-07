import { Router } from 'express';
import { passportCall } from '../utils.js'
import { auth } from '../middleware/auth.js';
import { getAllProducts, getProductByPid, createNewProduct, updateProduct,deleteProduct} from '../controllers/product_controller.js';

export const router = Router()

router.get('/', passportCall('current'), getAllProducts)

router.get('/:pid', getProductByPid)

router.post('/', passportCall('current'), auth(['admin']), createNewProduct)

router.delete('/:pid', passportCall('current'), auth(['admin']), deleteProduct)

router.put('/:pid', passportCall('current'), auth(['admin']), passportCall('current'), updateProduct)