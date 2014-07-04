<?php
$rootPass = dirname(__FILE__). '/../';
$domainName = 'http://0.0.0.0:3000/';
// $domainName = 'http://192.168.33.10:3000/';
// echo $_SERVER[ 'SERVER_ADDR' ];
// require_once 'PHPUnit/Autoload.php';
require_once $rootPass. 'lib/db/Mapper/CheckinLogMapper.php';
require_once $rootPass. 'lib/db/Mapper/UserMapper.php';
require_once $rootPass. 'lib/db/Model/User.php';
require_once $rootPass. 'lib/db/Mapper/IDmMapper.php';
require_once $rootPass. 'lib/db/Model/CheckinLog.php';
require_once $rootPass. 'lib/db/dbfunctions.php';
require_once $rootPass. 'lib/db/dbFacade.php';
require_once $rootPass. 'lib/nfcParser.php';

// オプションをパース
$longopts = array("mock", "nfcpypath:", "test");
$options = getopt("", $longopts);

// 使用するDBの決定
$dbName = "sample";
if(array_key_exists('test', $options))	$dbName = 'test';
$pdo = getPDO($dbName);

// テスト時の初期化処理
if(array_key_exists('test', $options))	testInit();

// 読み込むpythonファイルの指定
$nfcpyPath = $rootPass. 'nfcpy/examples/tagtool.py';
if(array_key_exists('nfcpypath', $options))	$nfcpyPath = $options["nfcpypath"];
if(array_key_exists('mock', $options))	$nfcpyPath = "mock.py";

$imapper = new IDmMapper($pdo);
$umapper = new UserMapper($pdo);

while (true) {
	sleep(5);
	$result = tagToolsParser(exec('python '. htmlspecialchars($nfcpyPath)));
	if(!isset($result['IDm']))	continue;
	
	$dbfacade = DBFacade::I($pdo);
	$log = $dbfacade->checkin($result['IDm']); 
	$idm = $imapper->find($log->idm_id);
	$idmArray = $idm->toArray();
	$postData = array();
	var_dump($idm);
	if($idm != NULL){
		$postData += array('cardName' => $idm->card_name);
		$postData += array('checkinNum' => $idm->checkin_num);
		$user = $umapper->find($idm->user_id);
		$postData += array('userName' => $user->user_name);
	}
	$postData += array('IDm' => $result['IDm']);
	$postData += array('checkinTime' => $log->checkin_time);
	$result = file_get_contents(
		$domainName. "touch",
		false,
		stream_context_create(
			array(
				'http' => array(
				'method' => 'POST',
				'header' => implode(
					"\r\n",
					array(
						'Content-Type: application/x-www-form-urlencoded'
					)
				),
				'content' => http_build_query(
					array(
					'json' => json_encode((array)$postData),
					)
				)
				)
			)
		)
	);

	// この行を実行すると貯金箱からの入金機能が利用できる
	// 挙動が恐ろしいほど安定していないかつ現状では500円しか読み取れないので、デフォルトではコメントアウトしておく
	// exec("php observeMoneyBox.php &");


}

// DB clean up
function testInit(){
	$pdo = getPDO('test');

	$pdo->beginTransaction();
	$pdo->query('DELETE FROM CheckinLogs');
	$pdo->commit();
}
