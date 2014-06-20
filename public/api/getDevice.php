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
	$result = array();
	$result += array('idmId' => $idm->idm_id);
	$result += array('userId' => $idm->user_id);
	$result += array('idmNo' => $idm->idm_no);
	$result += array('cardName' => $idm->card_name);
	$results += $result;
}

header("Content-Type: application/json; charset=utf-8");
echo json_encode($results);

