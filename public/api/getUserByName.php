<?php
$rootPass = dirname(__FILE__). '/../../';
require_once $rootPass. 'lib/db/dbfunctions.php';
require_once $rootPass. 'lib/db/Model/User.php';
require_once $rootPass. 'lib/db/Mapper/UserMapper.php';
$pdo = getPDO($argv[2]);
$umapper = new UserMapper($pdo);
$user = $umapper->findByName( $argv[1] );
$userArray = (array)$user;
foreach ($userArray as $value) {// オブジェクトのネストを解消(だいぶ汚いので後で直す)
	$userArray = $value;
	break;
}
header("Content-Type: application/json; charset=utf-8");
echo json_encode((array)$userArray);
// echo json_encode($result);

