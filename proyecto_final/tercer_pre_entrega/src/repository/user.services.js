import { UserManagerMongo as UserDao} from "../dao/UserManager_mongo.js";

class UserService {
    constructor(dao){
        this.dao = dao
    }

    createUser = async(user) =>{
        return this.dao.create(user)
    }

    getUserBy = async (filter) => {
        return this.dao.getBy(filter)
    }

    getUserPopulate = async (filter) => {
        return await this.dao.getByPopulate(filter)
    }
}

export const userService = new UserService(new UserDao)