function flights(req, res) {
  var from = req.body.from;
  var to = req.body.to;
  var departure = req.body.departure;
  console.log("Flights API valled with from=" + from + ", to=" + to + ", departure=" + departure);

  // Allow cross origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (from == null) {
    res.status(400).send(JSON.stringify({error: "'from' missing in request body."}, null, 3));
    return;
  }
  if (to == null) {
    res.status(400).send(JSON.stringify({error: "'to' missing in request body."}, null, 3));
    return;
  }
  if (departure == null) {
    res.status(400).send(JSON.stringify({error: "'departure' missing in request body."}, null, 3));
    return;
  }


  res.send(JSON.stringify({result: "Hello flight!"}, null, 3));
}

// Export
module.exports = {
  flights: flights,
};
