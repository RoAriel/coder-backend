import { usersModel } from "./models/user.model.js"

export class UserManagerMongo{

    async create(user){
        let newUser=await usersModel.create(user)
        return newUser.toJSON()
    }

    async getBy(filtro={}){
        return await usersModel.findOne(filtro).lean()
    }

    async getByPopulate(filtro={}){
        return await usersModel.findOne(filtro).populate("cart").lean()
    }

}