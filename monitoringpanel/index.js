var app = require('express').createServer()
  , io = require('socket.io').listen(app);

var sock = new Object;

app.listen(81);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/jquery.js', function (req, res) {
  res.sendfile(__dirname + '/jquery.js');
});

app.get('/send/msg', function (req, res) {
 // res.writeHead(200,{'Content-Type': 'text/plain'});
  console.log(req.param('text','none message'));
  if ( getClientAddress(req).toString() == '127.0.0.1') {
    res.end();
    console.log('message emited');
    io.sockets.emit(req.param('group','monitoringpanel'),{ msg: req.param('text','none message') });
  }
  else {
    res.send('permission denied');
    res.end();
  }
});

io.sockets.on('connection', function (socket) {
//  socket.emit('monitoringpanel', { msg: 'Моя пошел работать.' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

// get client ip address
function getClientAddress(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}
