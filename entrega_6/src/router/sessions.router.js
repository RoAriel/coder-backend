import { Router } from "express";
import passport from 'passport';
import { UserManagerMongo as UserManager } from '../dao/UserManager_mongo.js'
import { CartManagerMongo as CartManager } from '../dao/CartManager_mongo.js'

export const router = new Router()

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

router.post("/login", passport.authenticate("login", {failureRedirect:"/api/sessions/error"}), async(req, res)=>{

    let { web } = req.body
    let usr = {...req.user}

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
