import jwt from "jsonwebtoken"

export const auth=(req, res, next)=>{
    console.log(req.cookies)
    if(!req.cookies["ecommerseCookie"]){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Usuario no autenticado`})
    }

    let token=req.cookies["ecommerseCookie"]
    console.log({token})
    try {
        let usuario=jwt.verify(token, process.env.SECRET)
        req.user=usuario
        console.log('user:', usuario);
        
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`${error}`})
    }


    next()
}