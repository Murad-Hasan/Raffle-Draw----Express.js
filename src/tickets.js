const Ticket = require("./Ticket");
const {readFile, writeFile} = require("./utils");

const tickets = symbol('tickets');

class ticketCollection {
  constructor(){
    this[tickets] = [];
  }
}

const collection = new ticketCollection();
