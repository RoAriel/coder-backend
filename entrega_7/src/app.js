import __dirname from './utils.js';
import path from 'node:path';
import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import passport from 'passport';
import { initPassport } from './config/passport.config.js';
import { router as sessionsRouter } from './router/sessions.router.js';
import { router as productRouter } from './router/product.router.js';
import { router as cartRouter } from './router/cart.router.js';
import { router as vistasRouter } from '../src/router/vistas.router.js'
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE = process.env.DATABASE;
const SECRET = process.env.SECRET;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())
initPassport()
app.use(passport.initialize())
// app.use(passport.session())


app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));



app.use('/api/sessions', sessionsRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', vistasRouter)


const server = app.listen(PORT, () => {
    console.log(`SERVER ONLINE  >>> PORT: ${PORT}`);
});

const connDB = async () => {
    try {

        await mongoose.connect(`${DATABASE_URL}`, { dbName: `${DATABASE}` })
        console.log(`DB ONLINE  >>> DBNAME: ${DATABASE}`)
    } catch (error) {
        console.log("Error al conectar a DB", error.message)
    }

}
connDB()