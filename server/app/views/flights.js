function flights(req, res) {
  // Allow cross origin
  res.set('Access-Control-Allow-Origin', '*');

  var from = req.body.from;
  var to = req.body.to;
  var departure = req.body.departure;

  if (from == null) {
    res.status(400).send("'from' missing in request body.");
  }
  if (to == null) {
    res.status(400).send("'to' missing in request body.");
  }
  if (departure == null) {
    res.status(400).send("'departure' missing in request body.");
  }

  console.log("Flights API valled with from=" + from + ", to=" + to + ", departure=" + departure);

  res.json({result: "Hello flight!"});
}

// Export
module.exports = {
  flights: flights,
};
