<?php
$rootPass = dirname(__FILE__). '/../';
// require_once 'PHPUnit/Autoload.php';
require_once $rootPass. 'lib/db/Mapper/PaymentMapper.php';
require_once $rootPass. 'lib/db/Model/Payment.php';
require_once $rootPass. 'lib/db/dbfunctions.php';

function getPaymentInstance($name = "test支払"){
	$payment = new Payment;
	$payment->payment_name = $name;
	$payment->user_id = 1;
	$payment->price = 100;
	$payment->datetime = date('Y-m-d');
	return $payment;
}

class PaymentMapperTest extends PHPUnit_Framework_TestCase{
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
		$pdo->query('DELETE FROM Payments');
		$pdo->commit();
	}

	public function testInsertPayment(){
		$payment = getPaymentInstance();
		$bmapper = new PaymentMapper(self::$pdo);
		$bmapper->insert($payment);
		// phpは、オブジェクトを参照渡しするので、insert後のPaymentオブジェクトをチェックすればよい
		$this->assertArrayHasKey('payment_id', $payment->toArray());
	}

	public function testUpdatePayment(){
		$bmapper = new PaymentMapper(self::$pdo);
		$payment = getPaymentInstance();
		$bmapper->insert($payment);

		// phpは、オブジェクトを参照渡しするので、insert後のPaymentオブジェクトをチェックすればよい
		$this->assertArrayHasKey('payment_id', $payment->toArray());

		$payment->payment_name = 'updatePayment';
		$bmapper->update($payment);

		// DBに保存されているかどうかを調べる
		$payment = $bmapper->find($payment->payment_id);
		$this->assertSame('updatePayment', $payment->payment_name);
	}

	public function testDeletePayment() {
		$payment = getPaymentInstance('deletePayment');
		$bmapper = new PaymentMapper(self::$pdo);

		$bmapper->insert($payment);
		$bmapper->delete($payment);
		$allPayments = $bmapper->findAll()->fetchAll();

		$this->assertEmpty($allPayments);
	}

	public function testFindPayment(){
		$PaymentName = "forFindPayment";
		$payment = getPaymentInstance($PaymentName);
		$bmapper = new PaymentMapper(self::$pdo);

		$bmapper->insert($payment);
		$newPayment = $bmapper->find($payment->payment_id);
		$this->assertEquals($PaymentName, $newPayment->payment_name);
	}

	public function testFindAllPayment(){
		$PaymentName = "forFindPayment";
		$PaymentName2 = "forFindPayment2";
		$payment = getPaymentInstance($PaymentName);
		$Payment2 = getPaymentInstance($PaymentName2);
		$Payments = array();
		array_push($Payments, $payment, $Payment2);

		$bmapper = new PaymentMapper(self::$pdo);

		$bmapper->insert($Payments);
		$newPayments = $bmapper->findAll()->fetchAll();
		$this->assertEquals(2, count($newPayments));
	}
}
