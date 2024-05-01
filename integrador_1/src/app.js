import __dirname from './utils.js';
import path from 'node:path';
import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import { router as productRouter } from './router/product.router.js';

const PORT = 3000;

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

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send('OK');
})

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('home');
})

app.use('/api/products', productRouter)

const server = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});

const connDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://roarieldev:coder2024@cluster0.onipizz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
            {
                dbName: 'coder-project'
            }
        )
        console.log("DB Online...!!!")
    } catch (error) {
        console.log("Error al conectar a DB", error.message)
    }

}
connDB()