import express from 'express'
import dotenv from 'dotenv'
const app = express();
import mongoose from "mongoose";
import {loginValidation, registerValidation} from "./validator.js";
import register from "./controllers/UserController.js"
import login from "./controllers/UserController.js";

mongoose.connect("mongodb://127.0.0.1:27017/mern-app")
    .then(() => console.log("connect to db"))
    .catch(er => console.log(er))

app.use(express.json())

// User route
app.post("/auth/register", registerValidation, register)
app.post("/auth/login", loginValidation, login)

dotenv.config()

const port = process.env.PORT || 3006;
app.listen(port, () => console.log("Server is running on port: " + port))