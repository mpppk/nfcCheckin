var express = require('express');
var http = require('http');
routes = require('./routes/main.js');
var app = express();
// var flash = require("connect-flash");
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

// ルーティングの設定
app.get('/', routes.index);
app.get('/logs', routes.getLogs);
app.get('/user/:id([0-9]+)', routes.getUser);
app.post('/login',
		passport.authenticate('local', { successRedirect: '/',
																		 failureRedirect: '/',
																		 failureFlash: false })
);

var server = http.createServer(app);
server.listen(3000);
var io = require('socket.io').listen(server);

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

// io.sockets.on('emit_from_client', function (socket) {
//     socket.emit('emit_from_server', msg);
// });
