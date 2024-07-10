import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import passport from "passport";
import { isValidObjectId } from 'mongoose';
import { CustomError } from './utils/CustomError.js'
import { errorCause } from './utils/errorCause.js';
import { TIPOS_ERROR } from './utils/EErrors.js';
import winston from "winston"

let env = `${process.env.NODE_ENV}`


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const generaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const validaPasword = (password, passwordHash) => bcrypt.compareSync(password, passwordHash);

export const passportCall = (strategy) => function (req, res, next) {

  passport.authenticate(strategy, function (err, user, info, status) {
    if (err) { return next(err) }
    if (!user) {
      res.setHeader('Content-Type', 'application/json');

      return res.status(400).json({ error: info.message ? info.message : info.toString() })
    }
    req.user = user
    return next()
  })(req, res, next);
}

export const errorSiNoEsValidoID = (id, description) => {
  if (!(isValidObjectId(id))) {
    errorName = 'ObjectId no valido'
    return CustomError.createError(errorName,
      errorCause('addProductToCart', errorName, `${description} isValidObjectId: ${isValidObjectId(id)} - value: ${id}`),
      "Favor de corrigir el argumento", TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
  }

}


const customLevels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5
}

const logColors = {
  fatal: "bold inverse red",
  error: "bold  red",
  warning: "bold yellow",
  info: "white",
  http: "cyan",
  debug: "bold inverse green"
}

let m_format = winston.format.combine(
  winston.format.colorize({ colors: logColors, }),
  winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A', }),
  winston.format.simple(),
  winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
)

export const logger = winston.createLogger(
  {
    levels: customLevels,
    transports: []
  }
)

const transpConsola = (level) => {
  return new winston.transports.Console(
    {
      level: `${level}`,
      format: m_format,
    }
  )
}


const transpFile = (level) => {
  return new winston.transports.File(
    {
      level: `${level}`,
      filename: `./src/logs/${level}.log`,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A', }),
        winston.format.json()
      )
    }
  )
}

if (env == 'DEV') {

  logger.add(transpConsola('debug'))

} else {
  logger.add(transpConsola('info'))
  logger.add(transpFile('error'))
}
