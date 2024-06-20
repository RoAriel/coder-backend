import mongoose from 'mongoose'

export const ticketModel = mongoose.model('ticket', new mongoose.Schema({
    code: String,
    purchase_datetime: String,
    amount: Number,
    purchaser: String
},
    {
        timestamps: true,
        strict: true
    }
))