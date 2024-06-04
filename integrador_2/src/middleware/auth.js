import jwt from "jsonwebtoken"

export const auth=(req, res, next)=>{
    if(!req.cookies["ecommerseCookie"]){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Usuario no autenticado`})
    }

    let token=req.cookies["ecommerseCookie"]
    try {
        let usuario=jwt.verify(token, process.env.SECRET)
        req.user=usuario
        
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`${error}`})
    }


    next()
}