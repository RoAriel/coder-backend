import __dirname from './utils.js';
import path from 'node:path';
import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import { router as productRouter } from './router/product.router.js';
import { router as cartRouter } from './router/cart.router.js';
import { router as vistasRouter } from '../src/router/vistas.router.js'

const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE = process.env.DATABASE;

const app = express();

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

app.use('/api/products', productRouter)

app.use('/api/carts', cartRouter)
app.use('/', vistasRouter)

const server = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});

const connDB = async () => {
    try {

        await mongoose.connect(`${DATABASE_URL}`,
            {
                dbName: `${DATABASE}`
            }
        )
        console.log("DB Online...!!!")
    } catch (error) {
        console.log("Error al conectar a DB", error.message)
    }

}
connDB()