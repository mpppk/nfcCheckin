<?php
$rootPass = dirname(__FILE__). '/../';
// require_once 'PHPUnit/Autoload.php';
require_once $rootPass. 'lib/db/Mapper/DepositMapper.php';
require_once $rootPass. 'lib/db/Model/Deposit.php';
require_once $rootPass. 'lib/db/dbfunctions.php';

function getDepositInstance($name = "test入金"){
	$deposit = new Deposit;
	$deposit->deposit_name = $name;
	$deposit->user_id = 1;
	$deposit->price = 100;
	$deposit->datetime = date('Y-m-d');
	return $deposit;
}

class DepositMapperTest extends PHPUnit_Framework_TestCase{
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
		$pdo->query('DELETE FROM Deposits');
		$pdo->commit();
	}

	public function testInsertDeposit(){
		$deposit = getDepositInstance();
		$bmapper = new DepositMapper(self::$pdo);
		$bmapper->insert($deposit);
		// phpは、オブジェクトを参照渡しするので、insert後のDepositオブジェクトをチェックすればよい
		$this->assertArrayHasKey('deposit_id', $deposit->toArray());
	}

	public function testUpdateDeposit(){
		$bmapper = new DepositMapper(self::$pdo);
		$deposit = getDepositInstance();
		$bmapper->insert($deposit);

		// phpは、オブジェクトを参照渡しするので、insert後のBillオブジェクトをチェックすればよい
		$this->assertArrayHasKey('deposit_id', $deposit->toArray());

		$deposit->deposit_name = 'updateBill';
		$bmapper->update($deposit);

		// DBに保存されているかどうかを調べる
		$deposit = $bmapper->find($deposit->deposit_id);
		$this->assertSame('updateBill', $deposit->deposit_name);
	}

	public function testDeleteBill() {
		$deposit = getDepositInstance('deleteBill');
		$bmapper = new DepositMapper(self::$pdo);

		$bmapper->insert($deposit);
		$bmapper->delete($deposit);
		$allBills = $bmapper->findAll()->fetchAll();

		$this->assertEmpty($allBills);
	}

	public function testFindBill(){
		$depositName = "forFindBill";
		$deposit = getDepositInstance($depositName);
		$bmapper = new DepositMapper(self::$pdo);

		$bmapper->insert($deposit);
		$newDeposit = $bmapper->find($deposit->deposit_id);
		$this->assertEquals($depositName, $newDeposit->deposit_name);
	}

	public function testFindAllDeposit(){
		$depositName = "forFindDeposit";
		$depositName2 = "forFindDeposit2";
		$deposit = getDepositInstance($depositName);
		$deposit2 = getDepositInstance($depositName2);
		$deposits = array();
		array_push($deposits, $deposit, $deposit2);

		$bmapper = new DepositMapper(self::$pdo);

		$bmapper->insert($deposits);
		$newDeposits = $bmapper->findAll()->fetchAll();
		$this->assertEquals(2, count($newDeposits));
	}
}
