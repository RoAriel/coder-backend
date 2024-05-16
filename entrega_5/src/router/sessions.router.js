import { Router } from "express";
import { UserManagerMongo as UserManager } from '../dao/UserManager_mongo.js'
import { CartManagerMongo as CartManager } from '../dao/CartManager_mongo.js'
import { generaHash } from '../utils.js'

export const router = new Router()

const usrm = new UserManager()
const cm = new CartManager()

router.post('/registro', async (req, res) => {
console.log('hola');

    let { name, email, password, web } = req.body

    if (!name || !email || !password) {
        if (web) {
            return res.redirect('/registro?error=Complete nombre, email, y password')
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Complete nombre, email, y password` })
        }
    }

    let exist = usrm.getBy({ email })
    if (exist) {
        if (web) {
            return res.redirect(`/registro?error=Ya existe ${email}`)
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ya existe ${email}` })
        }
    }

    password = generaHash(password)

    try {
        let newCart = cm.create()
        let newUser = usrm.create({ name, email, password, rol: 'user', cart: newCart._id })

        if (web) {
            return res.redirect(`/login?mensaje=Registro correcto para ${name}`)
        } else {
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json({
                message: "Registro correcto...!!!", newUser
            })
        }

    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
})