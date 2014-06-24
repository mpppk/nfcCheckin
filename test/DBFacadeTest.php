<?php
$rootPass = dirname(__FILE__). '/../';
// require_once 'PHPUnit/Autoload.php';
require_once $rootPass. 'lib/db/Mapper/IDmMapper.php';
require_once $rootPass. 'lib/db/Model/IDm.php';
require_once $rootPass. 'lib/db/Mapper/CheckinLogMapper.php';
require_once $rootPass. 'lib/db/Model/CheckinLog.php';
require_once $rootPass. 'lib/db/Mapper/PaymentMapper.php';
require_once $rootPass. 'lib/db/Model/Payment.php';
require_once $rootPass. 'lib/db/Mapper/DepositMapper.php';
require_once $rootPass. 'lib/db/Model/Deposit.php';
require_once $rootPass. 'lib/db/dbfunctions.php';
require_once $rootPass. 'lib/db/dbFacade.php';

// 指定したパラメータのidmインスタンスを返す
function getIDmInstance($arg_userId = 1, $arg_idmNo = 12345){
	$idm = new IDm;
	$idm->user_id = $arg_userId;
	$idm->idm_no = $arg_idmNo;
	return $idm;
}

function getLogInstance($idmId = 1){
	$log = new CheckinLog;
	$log->idm_id = $idmId;
	return $log;
}

function getPaymentInstance($name = "test支払"){
	$payment = new Payment;
	$payment->payment_name = $name;
	$payment->user_id = 1;
	$payment->price = 100;
	$payment->datetime = date('Y-m-d');
	return $payment;
}

function getDepositInstance($name = "test入金"){
	$deposit = new Deposit;
	$deposit->deposit_name = $name;
	$deposit->user_id = 1;
	$deposit->price = 100;
	$deposit->datetime = date('Y-m-d');
	return $deposit;
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
        $pdo->query('DELETE FROM Payments');
        $pdo->query('DELETE FROM Deposits');
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

		// IDmテーブルに存在しないIDmでチェックインした場合
		$dbfacade->checkin('unknownIDm');
		$log = $cmapper->findByIDmId($idm->idm_id);
		$this->assertEquals($log->idm_id, $idm->idm_id);
	}

	public function testGetAllLog(){
		$imapper = new IDmMapper(self::$pdo);
		$cmapper = new CheckinLogMapper(self::$pdo);

		// IDmテーブルにレコードを追加
		$idm = getIDmInstance();
		$imapper->insert($idm);

		// すでにIDmテーブルに存在するIDmでチェックインした場合
		$dbfacade = DBFacade::I(self::$pdo);
		$dbfacade->checkin($idm->idm_no);

		// IDmテーブルに存在しないIDmでチェックインした場合
		$dbfacade->checkin('unknownIDm');

		$dbfacade = DBFacade::I(self::$pdo);
		// var_dump( $dbfacade->getAllLog() );
	}

	public function testUserByDate(){
		$cmapper = new CheckinLogMapper(self::$pdo);
		$dbfacade = DBFacade::I(self::$pdo);
		$log = getLogInstance();
		$cmapper->insert($log);
		$newLogs = $dbfacade->findUserByDate(date('Y-m-d'));
		// echo 'log: ';
		// var_dump( $log);
		// echo 'new log: ';
		// var_dump($newLogs);
		// echo 'date: '. $newLogs[0]['checkin_time'];
		$this->assertEquals($log->checkin_time, $newLogs[0]['checkin_time']);
	}

	public function testfindLOCAByUserID(){
		$pmapper = new PaymentMapper(self::$pdo);
		$dmapper = new DepositMapper(self::$pdo);
		$dbfacade = DBFacade::I(self::$pdo);
		$payment = getPaymentInstance();
		$deposit = getDepositInstance();
		$pmapper->insert($payment);
		$dmapper->insert($deposit);
		$result = $dbfacade->findLOCALogByUserID(1);// instanceは二つともuser_id=1になっているため
		$this->assertEquals(2, count($result));
	}

}
