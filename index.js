const express = require("express");
const app = express();

const port = 5000;
var greeting = require('./api/greeting.js');
var presence = require('./api/presence.js');
var sentences = require('./api/sentences.js');
var index = require('./api/index.js');

// Body parser
app.use(express.urlencoded({ extended: false }));

// Listen on port 5000
app.listen(port, () => {
  console.log(`Server is booming on port 5000
Visit http://localhost:5000`);
});

// Import Dependencies

//Specify port

// Body parser

// Home route
app.get("/", (req, res) => {
    res.send("Discord Bot NekonyAn is online!");
  });

  // Mock APIs
//   app.get("/users", (req, res) => {
//     res.json([
//       { name: "William", location: "Abu Dhabi" },
//       { name: "Chris", location: "Vegas" }
//     ]);
//   });
  
//   app.post("/user", (req, res) => {
//     const { name, location } = req.body;
  
//     res.send({ status: "User created", name, location });
//   });