var dbName = 'sample';

exports.index = function(req, res){
	res.render('index', { title: 'Express' });
};

exports.getLogs = function(req, res){
	var spawn = require('child_process').spawn;
	var php = spawn('php', ['public/api/getLog.php', dbName]);
	// var php = spawn('php', ['public/api/getLog.php', dbName]);
	php.stdout.on('data', function(data){
		res.end(data);
		// res.send(data);
	});

	php.stderr.on('data', function(data){
		res.send('stderr: ' + data);
	});

	php.on('exit', function(code){
	});
}

// 指定されたidのユーザ情報を返す
exports.getUser = function(req, res){
	var spawn = require('child_process').spawn;
	var php = spawn('php', ['public/api/getUser.php ', req.params.id, dbName]);
	php.stdout.on('data', function(data){
		res.send(data);
	});

	php.stderr.on('data', function(data){
		res.send('stderr: ' + data);
	});

	php.on('exit', function(code){
	});
}

// 指定されたidのユーザが登録しているデバイスの情報を返す
exports.getDevice = function(req, res){
	var spawn = require('child_process').spawn;
	var php = spawn('php', ['public/api/getDevice.php ', req.params.id, dbName]);
	php.stdout.on('data', function(data){
		res.send(data);
	});

	php.stderr.on('data', function(data){
		res.send('stderr: ' + data);
	});

	php.on('exit', function(code){
	});
}

exports.touch = function(req, res){
	// req.body.jsonの中身
	// cardName, checkinNum, userName, IDm, checkinTime
	io.sockets.emit('touched', req.body.json);
	if(isSyncMode){
		syncSocket.emit('deviceFound', req.body.json);
	}
	res.send('touched');
}

exports.getCheckinMember = function(req, res){
	var month = ('0' + req.params.month).slice(-2);
	var day = ('0' + req.params.day).slice(-2);
	var date = req.params.year + '-' + month + '-' + day;
	var spawn = require('child_process').spawn;
	var php = spawn('php', ['public/api/getCheckinMember.php ', date, dbName]);
	php.stdout.on('data', function(data){
		res.send(data);
	});

	php.stderr.on('data', function(data){
		res.send('stderr: ' + data);
	});

	php.on('exit', function(code){
	});
}

exports.getLOCAOfMonth = function(req, res){
	var month = ('0' + req.params.month).slice(-2);
	var spawn = require('child_process').spawn;
	var php = spawn('php', ['public/api/getLOCALogOfMonth.php ', req.params.year, month, req.params.type, dbName]);
	php.stdout.on('data', function(data){
		res.send(data);
	});

	php.stderr.on('data', function(data){
		res.send('stderr: ' + data);
	});

	php.on('exit', function(code){
	});
}

exports.getLOCALogs = function(req, res){
	var spawn = require('child_process').spawn;
	var php = spawn('php', ['public/api/getLOCALog.php', req.params.id, dbName]);
	php.stdout.on('data', function(data){
		res.end(data);
	});

	php.stderr.on('data', function(data){
		res.end('stderr: ' + data);
	});

	php.on('exit', function(code){
	});
}

exports.getLogsByUserID = function(req, res){
	var spawn = require('child_process').spawn;
	var php = spawn('php', ['public/api/getCheckinLogByUserID.php', req.params.userid, dbName]);
	php.stdout.on('data', function(data){
		res.end(data);
	});

	php.stderr.on('data', function(data){
		res.end('stderr: ' + data);
	});

	php.on('exit', function(code){
	});
}

exports.setLOCAData = function(req, res){
	// DBに登録
	var date = new Date();
	var month = ('0' + date.getMonth()).slice(-2);
	var day = ('0' + date.getDate()).slice(-2);
	var datetime = date.getFullYear() + '-' + month + '-' + day;
	var data = {
		userID: req.params.user_id,
		name: req.params.name,
		datetime: datetime,
		price: req.params.price,
		type: req.params.type
	}
	io.sockets.emit('LOCAChanged', data);
	res.send('set loca data.\n');
}
