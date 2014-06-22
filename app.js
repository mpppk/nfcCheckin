var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var http = require('http');
routes = require('./routes/main.js');
var app = express();
var flash = require("connect-flash");
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
		done(null, user.email);
});

passport.deserializeUser(function(user, done){
		done(null, user.email);
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			console.log('in user.findOne callback');
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			if (!user.validPassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		});
	}
));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use(methodOverride());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
// app.use(express.bodyParser());

// ルーティングの設定
app.get('/', routes.index);
app.get('/logs', routes.getLogs);
app.post('/addLog', routes.addLog);
app.get('/user/:id([0-9]+)', routes.getUser);
app.get('/device/:id([0-9]+)', routes.getDevice);
// app.get('/checkinMember', routes.getLogs);
app.get('/checkinMember/:year([0-9]+)/:month([0-9]+)/:day([0-9]+)', routes.getCheckinMember);
app.post('/login',
passport.authenticate('local', { successRedirect: '/',
	 failureRedirect: '/',
	 failureFlash: false })
);

var server = http.createServer(app);
server.listen(3000);
io = require('socket.io').listen(server);

// var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
		//クライアント側からのイベントを受け取る。
		socket.on('emit_from_client', function (msg) {
				//イベントを実行した方に実行する
				socket.emit('emit_from_server', msg + 'from server');
				//イベントを実行した方以外に実行する
				socket.broadcast.emit('emit_from_server', msg + 'from server');
		});
		//接続が解除された時に実行する
		socket.on('disconnect', function() {
				// log('disconnected');
		});
});

// var addLog = function(req, res){
// 	console.log('log posted');
// }
