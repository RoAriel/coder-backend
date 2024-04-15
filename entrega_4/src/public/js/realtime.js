const socket = io();

let ulPorductos = document.getElementById('productos');

socket.on("nuevoProducto", product =>{
    ulPorductos.innerHTML += `<li>${product}</li>`
})

socket.on("productos", products => {
    ulPorductos.innerHTML ="";
    products.forEach(p => {
        ulPorductos.innerHTML += `<li>${p.title}</li>`
        
    });
})