<?php
$rootPass = dirname(__FILE__). '/../';
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

$nfcpyPath = 'tagtool.py';
if(array_key_exists('nfcpypath', $options))	$nfcpyPath = $options["nfcpypath"];
if(array_key_exists('mock', $options))	$nfcpyPath = "mock.py";

while (true) {
	$result = tagToolsParser(exec('python '. htmlspecialchars($nfcpyPath)));
	$dbfacade = DBFacade::I($pdo);
	$dbfacade->checkin($result['IDm']);
	echo "checkin. idm(". $result['IDm']. ")\n";
	sleep(5);
}

// DB clean up
function testInit(){
	$pdo = getPDO('test');

	$pdo->beginTransaction();
	$pdo->query('DELETE FROM CheckinLogs');
	$pdo->commit();
}
