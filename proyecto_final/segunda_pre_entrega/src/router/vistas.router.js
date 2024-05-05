import { Router } from "express";
import __dirname from "../utils.js";

export const router = Router()

router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('home');
})
