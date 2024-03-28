import express from 'express';
import { router as productsRouter } from "./router/productsRouter.js"
const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", productsRouter)

app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});