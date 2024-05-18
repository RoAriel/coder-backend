import passport from "passport";
import local from 'passport-local'
import { UserManagerMongo as UserManager } from '../dao/UserManager_mongo.js'
import { generaHash, validaPasword } from '../utils.js'

const usrm = new UserManager()

//paso 1
export const initPassport = () => {

    passport.use(
        "registro",
        new local.Strategy(
            {
                usernameField: 'email',
                passReqToCallback: true

            },

            async (req, username, password, done) => {

                try {

                    let { name } = req.body
                    if (!name) return done(null, false)

                    let exist = await usrm.getBy({ email: username })
                    if (exist) return done(null, false)

                    password = generaHash(password)

                    let newUser = await usrm.create({ name, email: username, password, rol: 'user' })
                    return done(null, newUser)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.serializeUser((usuario, done) => {
        return done(null, usuario._id)
    })

    passport.deserializeUser(async (id, done) => {
        let usuario = await usrm.getBy({ _id: id })
        return done(null, usuario)
    })

}