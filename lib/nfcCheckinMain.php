<?php
$rootPass = dirname(__FILE__). '/../';
$domainName = 'http://192.168.33.10:8888/';
// require_once 'PHPUnit/Autoload.php';
require_once $rootPass. 'lib/db/Mapper/CheckinLogMapper.php';
require_once $rootPass. 'lib/db/Model/CheckinLog.php';
require_once $rootPass. 'lib/db/dbfunctions.php';
require_once $rootPass. 'lib/db/dbFacade.php';
require_once $rootPass. 'lib/nfcParser.php';

// オプションをパース
$longopts = array("mock", "nfcpypath:", "test");
$options = getopt("", $longopts);

// 使用するDBの決定
$dbName = "";
if(array_key_exists('test', $options))	$dbName = 'test';
$pdo = getPDO($dbName);

// テスト時の初期化処理
if(array_key_exists('test', $options))	testInit();

// 読み込むpythonファイルの指定
$nfcpyPath = $rootPass. 'nfcpy/examples/tagtool.py';
if(array_key_exists('nfcpypath', $options))	$nfcpyPath = $options["nfcpypath"];
if(array_key_exists('mock', $options))	$nfcpyPath = "mock.py";

while (true) {
	sleep(5);
	$result = tagToolsParser(exec('python '. htmlspecialchars($nfcpyPath)));
	if(!isset($result['IDm']))	continue;
	
	$dbfacade = DBFacade::I($pdo);
	$dbfacade->checkin($result['IDm']);
	// echo ($domainName. "loadLog");
	$res = file_get_contents($domainName. "loadLog");
	// $responce = http_get($domainName + '/loadLog');
	// echo "checkin. idm(". $result['IDm']. ")\n";
}

// DB clean up
function testInit(){
	$pdo = getPDO('test');

	$pdo->beginTransaction();
	$pdo->query('DELETE FROM CheckinLogs');
	$pdo->commit();
}
