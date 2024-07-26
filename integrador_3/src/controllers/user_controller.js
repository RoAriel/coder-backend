import { isValidObjectId } from "mongoose"
import { userService } from "../repository/user.services.js"
import { CustomError } from "../utils/CustomError.js"
import { errorCause } from "../utils/errorCause.js"
import { TIPOS_ERROR } from "../utils/EErrors.js"
import { enviarEmail } from "../utils/mailer.js"
import jwt from "jsonwebtoken"

let errorName
export const updateRol = async (req, res, next) => {
    let { uid } = req.params
    let userUpd
    let new_rol

    try {

        if(!isValidObjectId(uid)){
            errorName = 'Error en updateRol'
            CustomError.createError(errorName,errorCause('updateRol',errorName,`El uid es incorrecto. isValidObjectId: ${isValidObjectId(uid)}`),errorName, TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
        }

        let user = await userService.getUserBy({_id:uid})

        if (user.rol == 'user') new_rol = 'premium'
        if (user.rol == 'premium') new_rol = 'user'
        if (user.rol == 'admin') {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ msj: 'Admin simpre sera ADMIN' });
        }

        userUpd = await userService.updateUser(uid, { rol: new_rol })

        req.logger.info(`Se actualiza rol del usuario: ${user.email}, nuevo rol: ${userUpd.rol}`)

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: `Nuevo rol para user ${user.email}: ${userUpd.rol}` });

    } catch (error) {        
        next(error)
    }

}

export const recuperarPWemail = async (req, res) =>{

    let {email} = req.body
    let user = await userService.getUserBy({ email: email })

    let token = jwt.sign(user, process.env.SECRET, { expiresIn: '1h' })
    res.cookie("ecommerseRecupero", token, { httpOnly: true })
    
    let msj = `
    <p> Hola ${user.first_name} utiliza el siguiente botón para acceder al módulo de recuperación de contraseñas.</p>
    <a
    style = "background: #09f;
    cursor: pointer;
    border: none;
    padding: 15px 30px;
    color: white;
    font-size: 20px;
    font-weight: bold;
    position: relative;
    border-radius: 10px;
    text-decoration: none;" 
    href="http://localhost:${process.env.PORT}/newPassword/${token}">
  Recuperar contraseña
</a>
`
enviarEmail(email,'Solicitud de recuperacion de constraseña',msj)
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:'ok'});
}