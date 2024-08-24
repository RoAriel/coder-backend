import multer from "multer";
import __dirname from "../utils.js";

const storage =
    multer.diskStorage({
        destination:function(req,file,cb){
            
            if(file.fieldname == 'profile') cb(null,`${__dirname}/public/img_profile`)         
            if(file.fieldname == 'product') cb(null,`${__dirname}/public/img_product`)         
            if(file.fieldname == 'documents') cb(null,`${__dirname}/public/documents`)         
        },
        filename:function(req,file,cb){
    
                cb(null,`${Date.now()}-${file.originalname}`)
  
        }
    })

const uploader = multer({storage})

export default uploader;