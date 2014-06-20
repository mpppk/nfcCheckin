var dbName = 'sample';

exports.index = function(req, res){
	res.render('index', { title: 'Express' });
};

exports.getLogs = function(req, res){
	var spawn = require('child_process').spawn;
	var php = spawn('php', ['public/api/getLog.php', dbName]);
	// var php = spawn('php', ['public/api/getLog.php', dbName]);
	php.stdout.on('data', function(data){
		res.send(data);
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
