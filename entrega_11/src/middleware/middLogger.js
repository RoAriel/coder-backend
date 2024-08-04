import { logger } from "../utils.js"

export const middLogger=(req, res, next)=>{
    req.logger=logger

    next()
}