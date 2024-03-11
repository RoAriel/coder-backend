const ProductManager = require("./productManager");

const producto = new ProductManager();

console.log(producto.getProducts());

console.log(producto.addProduct('Mouse', 'Periferico', 45000, 'NoPhoto', 'm50', '50'));
console.log(producto.addProduct('Teclado', 'Periferico', 70000, 'NoPhoto', 't1000', '50'));
console.log(producto.addProduct('Monitor', 'Periferico', 45000, 'NoPhoto', 'mt50', '50'));

console.table(producto.getProducts());

console.log(producto.addProduct('Parante', 'Periferico', 50000, 'NoPhoto', 'mt50', '50'));

console.log(producto.getProduct(20));

console.table(producto.getProduct(2));