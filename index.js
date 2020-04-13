const express = require("express");
const app = express();

const port = 5000;

// Body parser
app.use(express.urlencoded({ extended: false }));

// Listen on port 5000
app.listen(port, () => {
  console.log(`Server is booming on port 5000
Visit http://localhost:5000`);
const greeting = require('./api/greeting');
const presence = require('./api/presence');
const sentences = require('./api/sentences');
const index = require('./api/index');
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