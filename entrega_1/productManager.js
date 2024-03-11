
class ProductManager{
    #elements;
    static nxtProductId = 0;

    constructor(){
        this.#elements = [];
    }

    getProducts(){
        return this.#elements;
    }

    addProduct(title, description, price, thumbnail, code, stock){

        if (!title || !description || !price || !thumbnail || !code || !stock)
            return 'Todos los campos son requeridos';

        let existCode = this.#elements.some(p => p.code == code);

        if (existCode) {return `El codigo: ${code}, ya existe para otro producto.`} 
        else{
            
            const id = ProductManager.nxtProductId;
            const product = {
                id : id,
                title : title, 
                description : description, 
                price : price, 
                thumbnail : thumbnail, 
                code : code, 
                stock : stock
            };

            this.#elements.push(product);
            
            ProductManager.nxtProductId++;

            return `Producto agregado. ID: ${id}`
        }
    };

    getProduct(id){
        let product = this.#elements.find(p => p.id == id);
        if (product != undefined)
            return product;
        else {
            return `Producto con id: ${id}, no encotrado.`
        }
    }

};

module.exports = ProductManager;