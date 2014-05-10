<?php
$rootPass = dirname(__FILE__). '/../';
// require_once 'PHPUnit/Autoload.php';
require_once $rootPass. 'lib/db/Mapper/CheckinLogMapper.php';
require_once $rootPass. 'lib/db/Model/CheckinLog.php';
require_once $rootPass. 'lib/db/dbfunctions.php';
require_once $rootPass. 'lib/db/dbFacade.php';
require_once $rootPass. 'lib/nfcParser.php';

$pdo = getPDO('test');

// DB clean up
$pdo->beginTransaction();
$pdo->query('DELETE FROM CheckinLogs');
$pdo->commit();

while (true) {
	$result = tagToolsParser(exec('python tagTools.py'));
	$dbfacade = DBFacade::I($pdo);
	$dbfacade->checkin($result['IDm']);
	sleep(5);
}
