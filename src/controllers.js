const ticketCollection = require("./tickets");

//ticket selling controllers

exports.sellSingleTicket = (req, res) => {
  const { username, price } = req.body;
  const ticket = ticketCollection.create(username, price);
  res.status(201).json({
    message: "Ticket created",
    ticket,
  });
};

exports.sellBulkTickets = (req, res) => {
  const { username, price, quality } = req.body;
  const tickets = ticketCollection.createBulk(username, price, quality);
  res.status(201).json({
    message: "Bulk Tickets created",
    tickets,
  });
};

//find tickets controller

exports.findAll = (req, res) => {
  const tickets = ticketCollection.find();
  res.status(200).json({
    items: tickets,
    total: tickets.length,
  });
};

exports.findById = (req, res) => {
  const { id } = req.params;
  const ticket = ticketCollection.findTicketById(id);
  if (!ticket) {
    res.status(404).json({
      message: "Ticket not found",
    });
  }
  res.status(200).json(ticket);
};

exports.findByUsername = (req, res) => {
  const { username } = req.params;
  const tickets = ticketCollection.findByUsername(username);
  res.status(200).json({
    items: tickets,
    total: tickets.length,
  });
};

//update controllers

exports.updateById = (req, res) => {
  const id = req.params.id;
  const ticket = ticketCollection.updateById(id, req.body);
  if (!ticket) {
    res.status(404).json({
      message: "Ticket not found",
    });
  }
  res.status(200).json(ticket);
};

exports.updateByUsername = (req, res) => {
  const username = req.params.username;
  const tickets = ticketCollection.updateBulk(username, req.body);
  res.status(200).json({
    items: tickets,
    total: tickets.length,
  });
};

//delete controllers

exports.deleteById = (req, res) => {
  const id = req.params.id;
  const isDeleted = ticketCollection.deleteById(id);
  if(isDeleted){
    return res.status(200).send();
  }
  res.status(404).json({
    message: "Delete operation failed",
  });
}

exports.deleteByUsername = (req, res) => {
  const username = req.params.username;
  ticketCollection.deleteBulk(username);
  res.status(200).send() ; 
}

//draw ticket controller

exports.drawWinners = (req, res) => {
  const wc = req.query.wc ?? 3;
  const winners = ticketCollection.draw(wc);
  res.status(200).json({
    winners
  });
}