const express = require('express');
const authenticationRoutes = require('./authentication.route');
const spsoRoutes = require('./spso.route');
const studentRoutes = require('./student.route');

const routes = express();

routes.use('/', authenticationRoutes);
routes.use('/spso', spsoRoutes);
routes.use('/student', studentRoutes);

module.exports = routes;