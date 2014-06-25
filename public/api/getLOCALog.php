<?php
$rootPass = dirname(__FILE__). '/../../';
require_once $rootPass. 'lib/db/dbfunctions.php';
require_once $rootPass. 'lib/db/Mapper/LOCALogMapper.php';
require_once $rootPass. 'lib/db/Model/LOCALog.php';
// $pdo = getPDO('test');
$pdo = getPDO($argv[2]);
$lmapper = new LOCALogMapper($pdo);
// $dbfacade = DBFacade::I($pdo);
$result = $lmapper->findAllByUserID( (int)$argv[1] );

header("Content-Type: application/json; charset=utf-8");
echo json_encode($result);

