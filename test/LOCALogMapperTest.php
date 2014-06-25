<?php
$rootPass = dirname(__FILE__). '/../';
// require_once 'PHPUnit/Autoload.php';
require_once $rootPass. 'lib/db/Mapper/LOCALogMapper.php';
require_once $rootPass. 'lib/db/Model/LOCALog.php';
require_once $rootPass. 'lib/db/dbfunctions.php';

function getLOCALogInstance($name = "test請求", $type = 'payment'){
	$loca = new LOCALog();
	$loca->name = $name;
	$loca->user_id = 1;
	$loca->price = 100;
	$loca->datetime = date('Y-m-d');
	$loca->type = $type;
	return $loca;
}

class LOCALogMapperTest extends PHPUnit_Framework_TestCase{
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
		$pdo->query('DELETE FROM LOCALogs');
		$pdo->commit();
	}

	public function testInsertLOCALog(){
		$loca = getLOCALogInstance();
		$bmapper = new LOCALogMapper(self::$pdo);
		$bmapper->insert($loca);
		// phpは、オブジェクトを参照渡しするので、insert後のLOCALogオブジェクトをチェックすればよい
		$this->assertArrayHasKey('loca_id', $loca->toArray());
	}

	public function testUpdateLOCALog(){
		$bmapper = new LOCALogMapper(self::$pdo);
		$loca = getLOCALogInstance();
		$bmapper->insert($loca);

		// phpは、オブジェクトを参照渡しするので、insert後のLOCALogオブジェクトをチェックすればよい
		$this->assertArrayHasKey('loca_id', $loca->toArray());

		$loca->name = 'updateLOCALog';
		$bmapper->update($loca);

		// DBに保存されているかどうかを調べる
		$loca = $bmapper->find($loca->loca_id);
		$this->assertSame('updateLOCALog', $loca->name);
	}

	public function testDeleteLOCALog() {
		$loca = getLOCALogInstance('deleteLOCALog');
		$bmapper = new LOCALogMapper(self::$pdo);

		$bmapper->insert($loca);
		$bmapper->delete($loca);
		$allLocas = $bmapper->findAll()->fetchAll();

		$this->assertEmpty($allLocas);
	}

	public function testFindLOCALog(){
		$LOCALogName = "forFindLOCALog";
		$loca = getLOCALogInstance($LOCALogName);
		$bmapper = new LOCALogMapper(self::$pdo);

		$bmapper->insert($loca);
		$newLOCALog = $bmapper->find($loca->loca_id);
		$this->assertEquals($LOCALogName, $newLOCALog->name);
	}

	public function testFindAllByUserID(){
		$LOCALogName = "forFindLOCALog";
		$LOCALogName2 = "forFindLOCALog2";
		$loca = getLOCALogInstance($LOCALogName);
		$locas2 = getLOCALogInstance($LOCALogName2);
		$locas = array();
		array_push($locas, $loca, $locas2);

		$bmapper = new LOCALogMapper(self::$pdo);

		$bmapper->insert($locas);
		$newLocas = $bmapper->findAllByUserID(1);
		$this->assertEquals(2, count($newLocas));
	}

	public function testFindAllOfMonth(){
		$LOCALogName = "forFindLOCALog";
		$LOCALogName2 = "forFindLOCALog2";
		$loca = getLOCALogInstance($LOCALogName);
		$loca->datetime = '2014-06-01';
		$loca2 = getLOCALogInstance($LOCALogName2);
		$loca2->datetime = '2014-06-30';
		$locas = array();
		array_push($locas, $loca, $loca2);

		$bmapper = new LOCALogMapper(self::$pdo);

		$bmapper->insert($locas);
		$newLocas = $bmapper->findAllOfMonth(2014, 6, 'payment');
		$this->assertEquals(2, count($newLocas));
	}


	public function testFindAllLOCALog(){
		$LOCALogName = "forFindLOCALog";
		$LOCALogName2 = "forFindLOCALog2";
		$loca = getLOCALogInstance($LOCALogName);
		$locas2 = getLOCALogInstance($LOCALogName2);
		$locas = array();
		array_push($locas, $loca, $locas2);

		$bmapper = new LOCALogMapper(self::$pdo);

		$bmapper->insert($locas);
		$newLocas = $bmapper->findAll()->fetchAll();
		$this->assertEquals(2, count($newLocas));
	}

}


