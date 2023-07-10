const express = require('express')
const dotenv = require('dotenv')
const app = express();
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017")
    .then(() => console.log("connect to db"))
    .catch(er => console.log(er))

app.use(express.json())
app.get("/", (req, res) => {
    console.log("start")
    res.send("Hello World")
})
app.post("/auth/login", (req, res) => {
    console.log(req.body)
    const token = jwt.sign(req.body, "12345678")
    res.json({"success": "yes", "token": token})
})

dotenv.config()
const port = process.env.PORT || 3006;
app.listen(port, () => console.log("Server is running on port: " + port))