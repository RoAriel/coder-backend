import { Router } from 'express';
import {join} from 'node:path'
import __dirname from '../utils.js';
import  CartManager from '../dao/CartManager.js';

export const router=Router()

const FILE_PATH = join(__dirname,'data','carts.json')

const cm = new CartManager(FILE_PATH)