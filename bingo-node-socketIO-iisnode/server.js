// Standard Modules for Express Node Js
var express       = require('express');
var path          = require('path');
var bodyParser    = require('body-parser');
var pug           = require('pug');

// Declare App to Express
var app           = express();

// Socket-io Modules
var http          = require('http').Server(app);
var io            = require('socket.io')(http);

//Setup Socket Server
var socket_server = require('./socket_server')(io);

// Declare Port
var port          = process.env.port || 8888;

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Sockets Route
require('./routes/sockets')(io, http);

// MC-Board Route
require('./routes/mc-board')(app);

// Admin Route
require('./routes/admin')(app);

// User-Board Route
require('./routes/user-board')(app);

// Listen on port
http.listen(port, function(){
  console.log('server started on port ' + port)
});
// console.log(http.close());
