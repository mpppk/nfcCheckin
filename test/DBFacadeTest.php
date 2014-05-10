<?php
$rootPass = dirname(__FILE__). '/../';
// require_once 'PHPUnit/Autoload.php';
require_once $rootPass. 'lib/db/Mapper/IDmMapper.php';
require_once $rootPass. 'lib/db/Model/IDm.php';
require_once $rootPass. 'lib/db/Mapper/CheckinLogMapper.php';
require_once $rootPass. 'lib/db/Model/CheckinLog.php';
require_once $rootPass. 'lib/db/dbfunctions.php';
require_once $rootPass. 'lib/db/dbFacade.php';

// 指定したパラメータのidmインスタンスを返す
function getIDmInstance($arg_userId = 1, $arg_idmNo = 12345){
	$idm = new IDm;
	$idm->user_id = $arg_userId;
	$idm->idm_no = $arg_idmNo;
	return $idm;
}

class DBFacadeTest extends PHPUnit_Framework_TestCase{
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
        $pdo->query('DELETE FROM IDms');
        $pdo->query('DELETE FROM CheckinLogs');
        $pdo->query('DELETE FROM IDms');
        $pdo->commit();
    }

    // checkinメソッドが正しく動作しているかのテスト
	public function testCheckin(){
		$imapper = new IDmMapper(self::$pdo);
		$cmapper = new CheckinLogMapper(self::$pdo);

		// IDmテーブルにレコードを追加
		$idm = getIDmInstance();
		$imapper->insert($idm);

		// すでにIDmテーブルに存在するIDmでチェックインした場合
		$dbfacade = DBFacade::I(self::$pdo);
		$dbfacade->checkin($idm->idm_no);
		$log = $cmapper->findByIDmId($idm->idm_id);
		$this->assertEquals($log->idm_id, $idm->idm_id);
	}
}
