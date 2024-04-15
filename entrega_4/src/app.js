import __dirname from './utils.js';
import path from 'node:path';
import express from 'express';
import {engine} from 'express-handlebars';
import {router as vistasRouter} from '../src/router/vistas.router.js'

const PORT=3000;

const app=express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'/public')));

app.use("/", vistasRouter)

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});
