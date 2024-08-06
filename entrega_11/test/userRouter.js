import { afterEach, before, describe, it } from "mocha"
import { expect } from "chai"
import supertest from "supertest"
import mongoose, { isValidObjectId, ObjectId } from "mongoose";
import { logger } from '../src/utils.js'
import { userService } from '../src/repository/user.services.js';


const PORT = process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE = process.env.DATABASE;

const connDB = async () => {
    try {

        await mongoose.connect(`${DATABASE_URL}`, { dbName: `${DATABASE}` })
        logger.info(`DB ONLINE (En modulo Test)>>> DBNAME: ${DATABASE}`)
    } catch (error) {
        console.log('ERROR:', error);

        logger.error("Error al conectar a DB", error.message)
    }

}

connDB()

const requester = supertest(`http://localhost:${PORT}`)

describe('Test sessions router', async function () {

    this.timeout(10000)

    afterEach(async function () {
        await userService.deleteUser({ email: "test@test.com" })
    })

    it("La ruta /api/sessions/registro, en su metodo post, crea un user", async () => {
        let userTest = {
            first_name: "Test",
            last_name: "TestDoc",
            age: -1,
            email: "test@test.com", //cambiar email para pruebas
            password: "123"
        }
        let { body } = await requester.post("/api/sessions/registro").send(userTest)

        expect(body.payload).to.exist
        expect(body.payload).to.be.equal("Registro correcto")
        expect(isValidObjectId(body.newUser._id)).to.be.true

    })

})