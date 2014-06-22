<?php
$rootPass = dirname(__FILE__). '/../../';
// $rootPass = dirname(__FILE__). '/../';
require_once $rootPass. 'lib/db/dbfunctions.php';
require_once $rootPass. 'lib/db/dbFacade.php';
$pdo = getPDO($argv[2]);
// $pdo = getPDO('test');
$dbfacade = DBFacade::I($pdo);
// $cmapper = new CheckinLogMapper($pdo);
header("Content-Type: application/json; charset=utf-8");
echo json_encode( $dbfacade->findUserByDate($argv[1]) );
// echo json_encode( $cmapper->findAllByDate($argv[1]) );

