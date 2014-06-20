<?php
$rootPass = dirname(__FILE__). '/../../';
require_once $rootPass. 'lib/db/dbfunctions.php';
require_once $rootPass. 'lib/db/Model/IDm.php';
require_once $rootPass. 'lib/db/Mapper/IDmMapper.php';
$pdo = getPDO($argv[2]);
// $pdo = getPDO('test');
$imapper = new IDmMapper($pdo);
$idmArray = $imapper->findAllIDmByUserId( (int)$argv[1] );
$results = array();
// var_dump($idmArray);
foreach ($idmArray as $idm) {
	$results[] = (array)$idm;
}

header("Content-Type: application/json; charset=utf-8");
echo json_encode($results);

