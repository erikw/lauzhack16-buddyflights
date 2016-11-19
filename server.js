var express = require('express')

var app = express()

app.get('/', function(req, res) {
  res.json({notes: "This is yorasdsdotebook. Edit this to start saving your notes!"})
})

app.listen(8000)
