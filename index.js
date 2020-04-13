const express = require("express");
const app = express();

const port = 5000;
var presence = require('./api/presence')
// Body parser
app.use(express.urlencoded({ extended: false }));

// Listen on port 5000
app.listen(port, () => {
  console.log(`Server is booming on port 5000
Visit http://localhost:5000`);
// presence();
});

app.get("/", (req, res) => {
  res.send("Server is online!");
});