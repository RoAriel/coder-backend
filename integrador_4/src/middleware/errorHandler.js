import { TIPOS_ERROR } from "../utils/EErrors.js";

export const errorHandler = (error, req, res, next) => {
console.log('ERROR:', error);

    req.logger.error(error.cause?error.cause:error.menssage)

    switch (error.code) {
        case TIPOS_ERROR.AUTENTICACION || TIPOS_ERROR.AUTORIZACION:
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: `Credenciales incorrectas` })

        case TIPOS_ERROR.ARGUMENTOS_INVALIDOS:
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `${error.message}` })

        case TIPOS_ERROR.NOT_FOUND:
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: `${error.message}` })

        default:
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error - contacte al administrador` })
    }
}