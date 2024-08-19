import mongoose from 'mongoose'

export const usersModel = mongoose.model('users', new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    email: {
        type: String, unique: true
    },
    password: String,
    rol: {
        type: String,
        enum: ['admin', 'user', 'premium'],
        default: "user"
    },
    cart: {
        type: mongoose.Types.ObjectId, ref: "carts"
    },
    documents: {
        type: [
            {
                name: { type: String },
                reference: { type: String }
            }
        ]
    }
    ,
    last_connection: { type: Date, default: Date.now },
    complete: {
        type: Boolean, default: false
    },
},
    {
        timestamps: true,
        strict: false
    }
))