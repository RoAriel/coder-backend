import { ticketModel } from "./models/ticket.model.js";

export class TicketManagerMongo{

    async create(ticket){
        let newTicket=await ticketModel.create(ticket)
        return newTicket.toJSON()
    }
}