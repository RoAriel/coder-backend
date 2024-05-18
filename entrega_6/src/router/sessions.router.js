import { Router } from "express";
import passport from 'passport';
import { UserManagerMongo as UserManager } from '../dao/UserManager_mongo.js'
import { CartManagerMongo as CartManager } from '../dao/CartManager_mongo.js'

export const router = new Router()

const usrm = new UserManager()
const cm = new CartManager()

router.post('/registro', passport.authenticate("registro", { failureRedirect: "/api/sessions/error" }), async (req, res) => {

    // Definicion anterior ver entrega_5 

    let web = req.body.web
    let newUser = req.user
    if (web) {
        return res.redirect(`/login?mensaje=Registro correcto para ${newUser.name}`)
    } else {
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json({
            message: "Registro correcto", newUser
        })
    }

})

router.post('/login', async (req, res) => {
    let { email, password, web } = req.body

    if (!email || !password) {
        if (web) {
            return res.redirect(`/login?error=Complete email, y password`)
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Complete email, y password` })
        }
    }

    let usr = await usrm.getByPopulate({ email })
    if (!usr) {

        if (web) {
            return res.redirect(`/login?error=Credenciales invalidas`)
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Credenciales inválidas` })
        }
    }

    if (!validaPasword(password, usr.password)) {
        if (web) {
            return res.redirect(`/login?error=Credenciales invalidas`)
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Credenciales inválidas` })
        }
    }

    usr = { ...usr }
    delete usr.password
    req.session.user = usr

    if (web) {
        res.redirect("/productos")
    } else {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: "Login correcto", usr });
    }
})

router.get("/logout", (req, res) => {
    req.session.destroy(e => {
        if (e) {
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

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: "Logout" });
})
