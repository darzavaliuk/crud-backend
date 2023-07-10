const express = require('express')

const app = express();

app.get("/", (req, res) => {
    console.log("start")
})

const port = 3005;

app.listen(port, () => console.log("Server is running on port: " + port))