var express = require('express');
var testController = require('../controllers/testController');
var auth = require('../middlewares/authenticate');

var app = express.Router();

app.get('/prueba_test', testController.prueba_test);
app.get('/verificar_token', auth.auth, testController.verificar_token);

module.exports = app;