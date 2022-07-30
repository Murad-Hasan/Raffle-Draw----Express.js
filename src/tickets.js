const Ticket = require("./Ticket");
const { readFile, writeFile } = require("./utils");

const tickets = Symbol("tickets");

class ticketCollection {
  constructor() {
    (async function () {
      this[tickets] = await readFile();
    }.call(this));
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
    writeFile(this[tickets]);
    return ticket; //in video it's show tickets.
  }

  /**
   *
   * @param {string} username
   * @param {number} price
   * @param {number} quantity
   * @returns {Ticket[]}
   */

  createBulk(username, price, quantity) {
    const result = [];
    for (let i = 0; i < quantity; i++) {
      const ticket = this.create(username, price);
      result.push(ticket);
    }
    writeFile(this[tickets]);
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
    const userTickets = this[tickets].filter(
      /**
       *
       * @param {Ticket} ticket
       *
       */
      (ticket) => ticket.username === username
    );

    return userTickets;
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
    writeFile(this[tickets]);
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
    writeFile(this[tickets]);
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
      writeFile(this[tickets]);
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
    writeFile(this[tickets]);
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

const Collection = new ticketCollection();

module.exports = Collection;
