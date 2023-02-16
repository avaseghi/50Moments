// CREATING A NODE.JS SERVER

const express = require("express");
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res) {
  res.render("index");
});

app.listen(port, () => console.log('listening on port ' + port));