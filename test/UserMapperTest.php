<?php
$rootPass = dirname(__FILE__). '/../';
// require_once 'PHPUnit/Autoload.php';
require_once $rootPass. 'lib/db/Mapper/UserMapper.php';
require_once $rootPass. 'lib/db/Model/User.php';
require_once $rootPass. 'lib/db/dbfunctions.php';

class UserMapperTest extends PHPUnit_Framework_TestCase{
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
        $pdo->query('DELETE FROM Users');
        $pdo->commit();
    }



	public function testInsertUser(){
		$umapper = new UserMapper(self::$pdo);
		$user = new User;
		$user->user_name = '自動testさん';
		$user->mail_address = 'autotest@dev.com';
		$user->profile = 'auto profile';
		$user->coin = 5;

		$umapper->insert($user);
		// phpは、オブジェクトを参照渡しするので、insert後のuserオブジェクトをチェックすればよい
		$this->assertArrayHasKey('user_id', $user->toArray());

	}
}


