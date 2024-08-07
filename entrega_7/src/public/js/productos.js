const comprar=async(pid,prdName)=>{
    let inputCart=document.getElementById("cart")
    let cid=inputCart.value
    console.log(`Codigo producto: ${pid}, Codigo Carrito: ${cid}`)

    let respuesta=await fetch(`/api/carts/${cid}/products/${pid}`,{
        method:"post"
    })
    if(respuesta.status===200){
        let datos=await respuesta.json()
        console.log(datos)
        Swal.fire({
            text:`Producto ${prdName} agregado!!!`,
            toast:true,
            position:"top-right"
        })
    }
}