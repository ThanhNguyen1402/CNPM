const express = require('express');
const { Login, Logout, IsLoggedIn } = require('../controller/authentication.controller');

const authenticationRoutes = express.Router();

authenticationRoutes.get('/', IsLoggedIn);
authenticationRoutes.post('/login', Login);
authenticationRoutes.delete('/logout', Logout);

module.exports = authenticationRoutes;