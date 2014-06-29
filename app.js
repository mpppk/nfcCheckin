var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');

var methodOverride = require('method-override');
var http = require('http');
routes = require('./routes/main.js');
var app = express();
var flash = require("connect-flash");
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
	// userIDのみを格納する
	var userInfo = usernameToID(user.username, 'sample');
	console.log(userInfo);
	console.log('serialize ' + user.username);
	done(null, user.username);
});

passport.deserializeUser(function(username, done){
	console.log('deserialize ' + username);
	done(null, username + ' hogehoge');
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		var user = {username: username, password: password}
		return done(null, user);
		// User.findOne({ username: username }, function(err, user) {
		// 	console.log('in user.findOne callback');
		// 	if (err) { return done(err); }
		// 	if (!user) {
		// 		return done(null, false, { message: 'Incorrect username.' });
		// 	}
		// 	if (!user.validPassword(password)) {
		// 		return done(null, false, { message: 'Incorrect password.' });
		// 	}
		// 	return done(null, user);
		// });
	}
));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use(methodOverride());
// app.use(cookieParser);
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
// app.use(express.bodyParser());

// ルーティングの設定
app.get('/', routes.index);
app.get('/logs', routes.getLogs);
app.get('/logs/:userid([0-9]+)', routes.getLogsByUserID);
app.post('/touch', routes.touch);
app.get('/user/:id([0-9]+)', routes.getUser);
app.get('/device/:id([0-9]+)', routes.getDevice);
app.get('/locaLog/:id([0-9]+)', routes.getLOCALogs);
app.get('/loca/:type/:name/:price([0-9]+)/:user_id([0-9]+)', routes.setLOCAData);
app.get('/checkinMember/:year([0-9]+)/:month([0-9]+)/:day([0-9]+)', routes.getCheckinMember);
app.get('/locaOfMonth/:year([0-9]+)/:month([0-9]+)/:type', routes.getLOCAOfMonth);

app.post('/login',
passport.authenticate('local', { successRedirect: '/',
	 failureRedirect: '/',
	 failureFlash: false })
);

var server = http.createServer(app);
server.listen(3000);
io = require('socket.io').listen(server);

// var io = require('socket.io').listen(app);

// グローバル汚染の罪を噛み締めながらsync状態を管理
isSyncMode = false;
syncSocket = null;

io.sockets.on('connection', function (socket) {
		//クライアント側からのイベントを受け取る。
		// socket.on('emit_from_client', function (msg) {
		// 		//イベントを実行した方に実行する
		// 		socket.emit('emit_from_server', msg + 'from server');
		// 		//イベントを実行した方以外に実行する
		// 		socket.broadcast.emit('emit_from_server', msg + 'from server');
		// });
		var timeoutID = 0;
		socket.on('applySyncRequest', function () {
			// 現在サーバーが他のユーザのデバイス同期を待っているかどうかを返す
			if(isSyncMode){
				socket.emit('syncRequestResponse', false);
			}else{
				socket.emit('syncRequestResponse', true);
				// そうでなければsync開始
				isSyncMode = true;
				syncSocket = socket;
				// 一定時間後にstop
				timeoutID = setTimeout(function(){
					isSyncMode = false;
				}, 10000);
			}

		});

		// クライアントが同期を中止した際に呼ばれる
		socket.on('stopSync', function(){
			isSyncMode = false;
			clearTimeout(timeoutID);// 何もしなくても10秒後には止まるが、クライアントが途中で切断された場合対策
		});

		socket.on('deviceAdded', function(data){
			// this.jsonの中身
			// cardName, checkinNum, userName, IDm, checkinTime
			io.sockets.emit('updateUser', data);
		});

		//接続が解除された時に実行する
		// socket.on('disconnect', function() {
		// 		// log('disconnected');
		// });
});

function usernameToID(username, db){
	var spawn = require('child_process').spawn;
	var php = spawn('php', ['public/api/getUser.php', username, db]);
	php.stdout.on('data', function(data){
		console.log('got data');
		cosole.log(data);
		return data;
	});

	php.stderr.on('data', function(data){
		console.log('got data failue');
		return data;
	});

	php.on('exit', function(code){
	});
}

