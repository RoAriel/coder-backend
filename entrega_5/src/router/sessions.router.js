import { Router } from "express";
import { UserManagerMongo as UserManager } from '../dao/UserManager_mongo.js'
import { CartManagerMongo as CartManager } from '../dao/CartManager_mongo.js'
import { generaHash, validaPasword} from '../utils.js'

export const router = new Router()

const usrm = new UserManager()
const cm = new CartManager()

router.post('/registro', async (req, res) => {
    let { name, email, password, web } = req.body

    if (!name || !email || !password) {
        if (web) {
            return res.redirect('/registro?error=Complete nombre, email, y password')
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Complete nombre, email, y password` })
        }
    }

    let exist = await usrm.getBy({ email })
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
        let newCart = await cm.create()
        let newUser = await usrm.create({ name, email, password, rol: 'user', cart: newCart._id })


        if (web) {
            return res.redirect(`/login?mensaje=Registro correcto para ${name}`)
        } else {
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json({
                message: "Registro correcto", newUser
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
    
    let usr = await usrm.getBy({email})
    if (!usr) {
 
        if (web) {
            return res.redirect(`/login?error=Credenciales invalidas`)
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Credenciales inválidas` })
        }
    }

    if(!validaPasword(password, usr.password)){
        if(web){
            return res.redirect(`/login?error=Credenciales invalidas`)
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Credenciales inválidas`})
        }  
    }

    usr = { ...usr }
    delete usr.password    
    req.session.user = usr

    if (web) {
        res.redirect("/perfil")
    } else {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: "Login correcto", usr });
    }
})

router.get("/logout", (req, res)=>{
    req.session.destroy(e=>{
        if(e){
            console.log(error);
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:`${error.message}`
                }
            )
            
        }
    })

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"Logout"});
})
