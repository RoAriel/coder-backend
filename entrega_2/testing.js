const { clear } = require("console");
const ProductManager = require("./productManager");

const path = "./files/products.json"


const app = async () => {
    try {
        
        const products = new ProductManager(path);
        console.log("Inicio del Product Manager: ", await products.getProducts());
        console.log("-------------------------------------------------")
        console.log(await products.addProduct("Monitor", "27''", 435000, "thumbnail", "m1000", 23))
        console.log("-------------------------------------------------")
        console.log(await products.addProduct("Monitor", "27''", 435000, "thumbnail", "m1000", 23))
        console.log("-------------------------------------------------")
        console.log(await products.addProduct("Teclado", "QWERTY", 23000, "thumbnail", "t1000", 20))
        console.log("-------------------------------------------------")
        console.log(await products.getProductById(1));
        console.log("-------------------------------------------------")
        console.log(await products.getProductById(3));
        console.log("-------------------------------------------------")
        console.log(await products.updateProduct(1, "stock", 100))
        console.log("-------------------------------------------------")        
        console.log(await products.updateProduct(0, "description", "40''"))
        console.log("-------------------------------------------------")        
        console.log(await products.updateProduct(0, "id", 10))
        console.log("-------------------------------------------------")        
        console.log(await products.updateProduct(0, "cualquiera", 10))
        console.log("-------------------------------------------------")       


        
    } catch (error) {
        console.error("El testApp fallo por el siguinte motivo: \n", error.message)
    }
   
}

app()
