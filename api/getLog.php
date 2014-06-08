<?php
$rootPass = dirname(__FILE__). '/../';
require_once $rootPass. 'lib/db/dbfunctions.php';
require_once $rootPass. 'lib/db/dbFacade.php';
$pdo = getPDO('test');
$dbfacade = DBFacade::I($pdo);
echo json_encode( $dbfacade->getAllLog() );

