const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const port = process.env.PORT || 5000;

//Database Connectivity
require("./db/db");

//Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//Routes
app.use(require("./api/routes/auth"));
app.use(require("./api/routes/post"));
app.use(require("./api/routes/user"));
app.use(require("./api/routes/chatBot"));

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});
