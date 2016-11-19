function flights(req, res) {
    res.json({notes: "Hello flight!"});
  }

// Export
module.exports = {
  flights: flights,
};
