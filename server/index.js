const cors = require('cors');
const session = require('express-session');
const express = require('express');
const http = require('http');
const PORT = require('./config/port.config.js');
const corsConfig = require('./config/cors.config.js');
const sessionConfig = require('./config/session.config.js');
const routes = require('./route/index.route.js');

const app = express();

app.use(express.json()); // Allows you to access the parsed JSON body of a request using req.body in your route handlers.
//app.use(express.urlencoded({ extended: true })); // This middleware is added to the application to parse incoming requests with Content-Type: application/x-www-form-urlencoded. The extended: true option allows for parsing rich objects and arrays.
app.use(cors(corsConfig));
app.use(session(sessionConfig));

app.use(routes);

const server = http.createServer(app);

server.listen(PORT, () =>
{
      console.log("Server listening on port " + PORT);
});