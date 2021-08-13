const express = require('express'); // "Request" library
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
require('dotenv').config()

const port = process.env.PORT || 4000

const path = require('path');

const GoogleRoute = require("./api/routes/google.route");

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.use(bodyParser.json({limit: "1000mb"}));
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "public"));
app.set("view engine", "ejs");

app.use("/api/google", GoogleRoute);

console.log(`Listening on ${port}`);
app.listen(port);