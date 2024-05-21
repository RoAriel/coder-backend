import passport from "passport";
import local from 'passport-local'
import github from 'passport-github2'
import { UserManagerMongo as UserManager } from '../dao/UserManager_mongo.js'
import { CartManagerMongo as CartManager } from '../dao/CartManager_mongo.js'
import { generaHash, validaPasword } from '../utils.js'

const usrm = new UserManager()
const cm = new CartManager()

//paso 1
export const initPassport = () => {

    passport.use('registro',

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

                    let cart = await cm.create()

                    let newUser = await usrm.create({ name, email: username, password, rol: 'user', cart: cart._id })
                    return done(null, newUser)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use('login',
        new local.Strategy(
            {
                usernameField: 'email'
            },

            async (username, password, done) => {
                try {

                    let user = await usrm.getBy({ email: username })

                    if (!user)
                        return done(null, false)

                    if (!validaPasword(password, user.password))
                        return done(null, false)

                    return done(null, user)

                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    const GIT_CLIENT = process.env.GIT_CLIENT
    const GIT_CLIENT_SECTRET = process.env.GIT_CLIENT_SECTRET
    
    passport.use('github',
        new github.Strategy(
            {
                clientID: `${GIT_CLIENT}`,
                clientSecret: `${GIT_CLIENT_SECTRET}`,
                callbackURL: 'http://localhost:3000/api/sessions/callbackGithub'
            },

            async (tokenAccess, tokenRefresh, profile, done) => {

                try {
                    let name = profile._json.name
                    let email = profile._json.email

                    if (!name || !email) return done(null, false)

                    let newUser = await usrm.getBy({ email: email })

                    if (!newUser){
                        let cart = await cm.create()
                        newUser = await usrm.create({ name, email,  rol: 'user', cart: cart._id, profile: profile })
                    }
                    
                    return done(null, newUser)
                } catch (error) {
                    return done(error)
                }
            }

        )
    )
    passport.serializeUser((user, done) => {
        return done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await usrm.getBy({ _id: id })
        return done(null, user)
    })

}