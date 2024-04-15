const socket = io();

let ulPorductos = document.getElementById('productos');

socket.on("nuevoProducto", product =>{
    ulPorductos.innerHTML += `<li>${product}</li>`
})