import __dirname from './utils.js';
import path from 'node:path';
import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import sessions from "express-session"
import { router as sessionsRouter } from './router/sessions.router.js';
import { router as productRouter } from './router/product.router.js';
import { router as cartRouter } from './router/cart.router.js';
import { router as vistasRouter } from '../src/router/vistas.router.js'

const PORT = process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE = process.env.DATABASE;

const app = express();

app.use(sessions({
    secret:"CoderCoder123", resave:true, saveUninitialized: true
}))

app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/sessions', sessionsRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

app.use('/', vistasRouter)

const server = app.listen(PORT, () => {
    console.log(`SERVER ONLINE || PORT: ${PORT}`);
});

const connDB = async () => {
    try {

        await mongoose.connect(`${DATABASE_URL}`,
            {
                dbName: `${DATABASE}`
            }
        )
        console.log(`DB ONLINE  || DBNAME: ${DATABASE}`)
    } catch (error) {
        console.log("Error al conectar a DB", error.message)
    }

}
connDB()