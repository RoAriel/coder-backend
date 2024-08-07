import mongoose from 'mongoose'

export const usersModel=mongoose.model('users',new mongoose.Schema({
    name: String,
    email:{
        type: String, unique:true
    }, 
    password: String,
    rol:{
        type: String, default:"user"
    }, 
    cart: {
        type: mongoose.Types.ObjectId, ref: "carts"
    }
}))