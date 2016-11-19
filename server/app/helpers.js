function setHeaders(res){
  res.setHeader('Content-Type', 'application/json');
}

function handleError(req, res, errors){
  res.status(400).send(errors);
}


// Export
module.exports = {
  setHeaders: setHeaders,
  handleError: handleError
};
