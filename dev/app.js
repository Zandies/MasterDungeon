var express = require('express');
var app = express();
var ejs = require('ejs');
var io = require('socket.io').listen(app.listen(3000));
var bodyParser = require('body-parser');
var session = require('cookie-session');

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function (req, res) {
   res.render('index.ejs');
});

// Quand un client se connecte, on le note dans la console et on lui envoie un message
io.sockets.on('connection', (socket) => {
   socket.pv = 15;
   socket.on('connexion', (data) => {
      socket.emit('connexion', socket.pv);
   });

   // Nouveau PV
   socket.on('changePV', (data) => {
      console.log("Client: Nouveau PV (" + data + ")");
      socket.broadcast.emit('newPV', data);
   });

});