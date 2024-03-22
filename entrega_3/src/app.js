const express = require("express");

const ProductManager = require("../classes/ProductManager")

const PORT = 3000;

const pm = new ProductManager("../data/products.json")

const app = express();

app.get('/products', async (req, res) =>{
    let prods = await pm.getProducts();
    
    let limit = Number(req.query.limit); 

    let isNAN = isNaN(limit)
    if(!isNAN && limit>0){
        prods = prods.slice(0,limit);
    }
        
    res.json(prods);

});

app.get('/products/:pid', async (req,res) =>{

    let pid = Number(req.params.pid)
    let prod = await pm.getProductById(pid);

    res.json(prod)


});

app.listen(PORT, ()=>{
    console.log(`Server online en puerto ${PORT}`)
})