import mongoose from "mongoose"

const messagesColl="messages"
const messagesSchema=new mongoose.Schema(
    {
        user: {type: String, unique: true, required:true}, 
        message: String
    },
    {
        timestamps:true,
        strict: false
    }
)

export const messageModel=mongoose.model(
    messagesColl, messagesSchema
)