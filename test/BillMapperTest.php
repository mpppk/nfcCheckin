<?php
$rootPass = dirname(__FILE__). '/../';
// require_once 'PHPUnit/Autoload.php';
require_once $rootPass. 'lib/db/Mapper/BillMapper.php';
require_once $rootPass. 'lib/db/Model/Bill.php';
require_once $rootPass. 'lib/db/dbfunctions.php';

function getBillInstance($name = "test請求"){
	$bill = new Bill;
	$bill->bill_name = $name;
	$bill->user_id = 1;
	$bill->price = 100;
	$bill->datetime = date('Y-m-d');
	return $bill;
}

class BillMapperTest extends PHPUnit_Framework_TestCase{
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
		$pdo->query('DELETE FROM Bills');
		$pdo->commit();
	}

	public function testInsertBill(){
		$bill = getBillInstance();
		$bmapper = new BillMapper(self::$pdo);
		$bmapper->insert($bill);
		// phpは、オブジェクトを参照渡しするので、insert後のBillオブジェクトをチェックすればよい
		$this->assertArrayHasKey('bill_id', $bill->toArray());
	}

	public function testUpdateBill(){
		$bmapper = new BillMapper(self::$pdo);
		$bill = getBillInstance();
		$bmapper->insert($bill);

		// phpは、オブジェクトを参照渡しするので、insert後のBillオブジェクトをチェックすればよい
		$this->assertArrayHasKey('bill_id', $bill->toArray());

		$bill->bill_name = 'updateBill';
		$bmapper->update($bill);

		// DBに保存されているかどうかを調べる
		$bill = $bmapper->find($bill->bill_id);
		$this->assertSame('updateBill', $bill->bill_name);
	}

	public function testDeleteBill() {
		$bill = getBillInstance('deleteBill');
		$bmapper = new BillMapper(self::$pdo);

		$bmapper->insert($bill);
		$bmapper->delete($bill);
		$allBills = $bmapper->findAll()->fetchAll();

		$this->assertEmpty($allBills);
	}

	public function testFindBill(){
		$billName = "forFindBill";
		$bill = getBillInstance($billName);
		$bmapper = new BillMapper(self::$pdo);

		$bmapper->insert($bill);
		$newBill = $bmapper->find($bill->bill_id);
		$this->assertEquals($billName, $newBill->bill_name);
	}

	public function testFindAllBill(){
		$billName = "forFindBill";
		$billName2 = "forFindBill2";
		$bill = getBillInstance($billName);
		$bill2 = getBillInstance($billName2);
		$bills = array();
		array_push($bills, $bill, $bill2);

		$bmapper = new BillMapper(self::$pdo);

		$bmapper->insert($bills);
		$newBills = $bmapper->findAll()->fetchAll();
		$this->assertEquals(2, count($newBills));
	}

}


