<?php
$rootPass = dirname(__FILE__). '/../';
// require_once 'PHPUnit/Autoload.php';
require_once $rootPass. 'lib/db/Mapper/CheckinLogMapper.php';
require_once $rootPass. 'lib/db/Model/CheckinLog.php';
require_once $rootPass. 'lib/db/dbfunctions.php';

function getLogInstance($idmId = 1){
	$log = new CheckinLog;
	$log->idm_id = $idmId;
	return $log;
}

class CheckinLogMapperTest extends PHPUnit_Framework_TestCase{
	static $pdo;

	// テスト開始時にテスト用のDBに接続する
	static function setUpBeforeClass(){
		$pdo = self::$pdo = getPDO('test');
	}

    //テストの度にDBをクリーンな状態に戻す。
    function setUp(){
        $pdo = self::$pdo;
        // DB clean up
        $pdo->beginTransaction();
        $pdo->query('DELETE FROM CheckinLogs');
        $pdo->commit();
    }

	public function testInsertLog(){
		$cmapper = new CheckinLogMapper(self::$pdo);
		$log = getLogInstance();
		$cmapper->insert($log);

		// phpは、オブジェクトを参照渡しするので、insert後のuserオブジェクトをチェックすればよい
		$this->assertArrayHasKey('checkin_id', $log->toArray());
	}

    public function testDeleteLog() {
        $cmapper = new CheckinLogMapper(self::$pdo);

		$log = getLogInstance();
        $cmapper->insert($log);
        $cmapper->delete($log->checkin_id);
        $allLogs = $cmapper->findAll()->fetchAll();

        $this->assertEmpty($allLogs);
    }

	public function testFindLog(){
		$cmapper = new CheckinLogMapper(self::$pdo);

		$log = getLogInstance();
        $cmapper->insert($log);
		$newLog = $cmapper->find($log->checkin_id);
		$this->assertEquals($log->checkin_time, $newLog->checkin_time);
	}

	public function testFindAllLog(){
		$cmapper = new CheckinLogMapper(self::$pdo);

		$log = getLogInstance();
        $cmapper->insert($log);
        $cmapper->insert($log);
		$newLogs = $cmapper->findAll()->fetchAll();
		$this->assertEquals(2, count($newLogs));
	}

	public function testModCheckinTime(){
		$cmapper = new CheckinLogMapper(self::$pdo);
		$log = getLogInstance();
		$cmapper->insert($log);
		$log->checkin_time = date('Y-m-d H:i:s');
		$cmapper->changeCheckinTime($log);
		$newLog = $cmapper->find($log->checkin_id);
		$this->assertEquals($newLog->checkin_time, $log->checkin_time);
	}
}
