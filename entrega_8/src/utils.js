import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const generaHash=password=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const validaPasword=(password, passwordHash)=>bcrypt.compareSync(password, passwordHash);

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