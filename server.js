const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { expressjwt: exjwt } = require("express-jwt");

const app = express();

const PORT = 3000;
const secretkey = "JSONWEBTOKEN-ASSIGNMENT!";

const jwtMV = exjwt({ secret: secretkey, algorithms: ["HS256"] });

const users = [
  {
    id: 1,
    username: "Yukta",
    password: "1234",
  },
  {
    id: 2,
    username: "Ajjampur",
    password: "5678",
  },
];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Content-type, Authorization");
  next();
});

app.use(function (err, req, res, next) {
  if (err.name == "UnauthorizedError") {
    res.status(401).json({
      success: false,
      officialErr: err,
      err: "Direct URL Access Not Allowed!",
    });
  } else {
    next(err);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  for (let user of users) {
    if (username == user.username && password == user.password) {
      let token = jwt.sign({ id: user.id, username: username }, secretkey, {
        expiresIn: "3m",
      });
      return res.json({
        success: true,
        err: null,
        token,
      });
    }
  }

  res.status(401).json({
    success: false,
    token: null,
    err: "Incorrect username or password",
  });
});

app.get("/api/dashboard", jwtMV, (req, res) => {
  res.json({
    success: true,
    myContent: "Secret Content that only logged in people can see!!",
  });
});

app.get("/api/settings", jwtMV, (req, res) => {
  res.json({
    success: true,
    myContent: "Settings page can only be seen after a valid login!",
  });
});

app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});