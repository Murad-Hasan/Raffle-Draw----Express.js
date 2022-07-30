const e = require("cors");
const Ticket = require("./Ticket");
const { readFile, writeFile } = require("./utils");

const tickets = symbol("tickets");

class ticketCollection {
  constructor() {
    this[tickets] = [];
  }
  /**
   * create and save a new ticket
   * @param {string} username
   * @param {number} price
   * @returns {Ticket}
   */
  create(username, price) {
    const ticket = new Ticket(username, price);
    this[tickets].push(ticket);
    return tickets;
  }

  /**
   *
   * @param {string} username
   * @param {number} price
   * @param {number} quality
   * @returns {Ticket[]}
   */

  createBulk(username, price, quality) {
    const result = [];
    for (let i = 0; i < quality; i++) {
      const ticket = new Ticket(username, price);
      result.push(ticket);
    }
    return result;
  }

  /**
   * return all ticket from db
   * @returns
   */

  find() {
    return this[tickets];
  }

  /**
   * find single ticket by id
   * @param {string} id
   * @returns {Ticket}
   */
  findTicketById(id) {
    const ticket = this[tickets].find((ticket) => ticket.id === id);
    return ticket;
  }

  /**
   * find tickets by username
   * @param {string} username
   * @returns {Ticket[]}
   * */
  findTicketsByUsername(username) {
    const tickets = this[tickets].filter(
      (ticket) => ticket.username === username
    );
    return tickets;
  }
  /**
   * update by id
   * @param {string} ticketId
   * @param {{username: string, price:number}} ticketBody
   * @returns {Ticket}
   */

  updateById(ticketId, ticketBody) {
    const ticket = this.findTicketById(ticketId);
    if (ticket) {
      ticket.username = ticketBody.username ?? ticket.username;
      ticket.price = ticketBody.price ?? ticket.price;
    }
    return ticket;
  }
  /**
   * bulk update by username
   * @param {string} username
   * @param {{username: string, price: number}} ticketBody
   * @returns {Ticket[]}
   */
  updateBulk(username, ticketBody) {
    const userTicket = this.findTicketsByUsername(username);
    const updatedTickets = userTicket.map(
      /**
       *
       * @param {Ticket} ticket
       */

      (ticket) => this.updateById(ticket.id, ticketBody)
    );
    return updatedTickets;
  }

  /**
   * delete by id
   * @param {string} ticketId
   * @returns {boolean}
   * */
  deleteById(ticketId) {
    const index = this[tickets].findIndex(
      /**
       * @param {Ticket} ticket
       */

      (ticket) => ticket.id === ticketId
    );
    if (index === -1) {
      return false;
    } else {
      this[tickets].splice(index, 1);
      return true;
    }
  }

  /**
   * Bulk delete by username
   * @param {string} username
   * @returns {boolean[]}
   */
  deleteBulk(username) {
    const userTicket = this.findTicketsByUsername(username);
    const deletedResult = userTicket.map(
      /**
       *
       * @param {Ticket} ticket
       */

      (ticket) => this.deleteById(ticket.id)
    );
    return deletedResult;
  }

  /**
   * find winners
   * @param {number} winnerCount
   * @returns {Ticket[]}
   */

  draw(winnerCount) {
    const winnerIndexes = new Array(winnerCount);
    let winnerIndex = 0;
    while (winnerIndex < winnerCount) {
      let ticketIndex = Math.floor(Math.random() * this[tickets].length);
      if (!winnerIndexes.includes(ticketIndex)) {
        winnerIndexes[winnerIndex] = ticketIndex;
        winnerIndex++;
      }
    }
    const winners = winnerIndexes.map(
      /**
       *
       * @param {number} index
       * @returns
       */
      (index) => this[tickets][index]
    );
    return winners;
  }
}

const collection = new ticketCollection();

module.exports = collection;
