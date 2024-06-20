import { Router } from 'express';
import { passportCall } from '../utils.js'
import { getAllProducts, getProductByPid, createNewProduct, updateProduct,deleteProduct} from '../controllers/product_controller.js';

export const router = Router()

router.get('/', passportCall('current'), getAllProducts)

router.get('/:pid', getProductByPid)

router.post('/', passportCall('current'), createNewProduct)

router.delete('/:pid', deleteProduct)

router.put('/:pid', passportCall('current'), updateProduct)