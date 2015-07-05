var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://angel:hackathon@ds059509.mongolab.com:59509/hackathon');

var Events = mongoose.model('event', new mongoose.Schema({
  description: Array,
  category: String,
  location: Object,
  extra: Object,
  created_at: {
    type: Date,
    default: new Date()
  },
  author: String,
  mins_ago: Number
}));

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

app.get('/api/events', function(req, res){
  console.log('GET /api/events');
  Events.find({ created_at: { $gte: new Date(Date.now() - 5 * 60000) } }).sort('-created_at').exec(function(err, results) {
//   Events.find({ created_at: { $gte: new Date(Date.now() - 0.5 * 3600000) } }, function (err, results) {
    if (err) return res.send(500, err);
    results.forEach(function(item) {
      item.mins_ago = Math.round((Date.now() - item.created_at.getTime()) / 60000);
    });
    console.log('done.');
    return res.status(200).send(results);
  });
});

var sockets = [];

app.get('/api/events/camera', function(req, res){
  var event = new Events({
    description: [req.query.address, req.query.desc2, req.query.desc3],
    category: req.query.category,
    location: {
      type: 'Point',
      coordinates: [req.query.lng, req.query.lat]
    },
    author: req.query.author
  });
  event.save(function (err) {
    if (err) return res.send(500, err);
    console.log(req.query);
    sockets.forEach(function(socket) {
      socket.emit('event', event);
    });
    return res.status(200).end();
  });
});

app.post('/api/events', function(req, res){
  console.log('POST /api/events');
  var event = new Events(req.body);
  event.save(function (err) {
    if (err) return res.send(500, err);
    console.log(req.body);
    sockets.forEach(function(socket) {
      socket.emit('event', event);
    });
    return res.status(200).end();
  });
});

app.listen(3000, '0.0.0.0');
console.log('Server listening on port 3000.');

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(4000);
console.log('Socket.io listening on port 4000.');

io.on('connection', function (socket) {
  sockets.push(socket);
  
//   Events.find({ created_at: { $gte: new Date(Date.now() - 0.5 * 3600000) } }).tailable().stream().on('data', function(event) {
//     socket.emit('events', event);
//   });
});
