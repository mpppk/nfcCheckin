<?php
$rootPass = dirname(__FILE__). '/../';
// require_once 'PHPUnit/Autoload.php';
require_once $rootPass. 'lib/db/Mapper/UserMapper.php';
require_once $rootPass. 'lib/db/Model/User.php';
require_once $rootPass. 'lib/db/dbfunctions.php';

function getUserInstance($name = "testたろう"){
	$user = new User;
	$user->user_name = $name;
	$user->mail_address = 'autotest@dev.com';
	$user->password = 'pass1234';
	$user->profile = 'auto profile';
	$user->coin = 5;
	return $user;
}

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
		$user->password = 'pass1234';
		$user->profile = 'auto profile';
		$user->coin = 5;

		$umapper->insert($user);
		// phpは、オブジェクトを参照渡しするので、insert後のuserオブジェクトをチェックすればよい
		$this->assertArrayHasKey('user_id', $user->toArray());
	}

	public function testUpdateUser(){
		$umapper = new UserMapper(self::$pdo);
		$user = getUserInstance('user');
		$umapper->insert($user);

		// phpは、オブジェクトを参照渡しするので、insert後のuserオブジェクトをチェックすればよい
		$this->assertArrayHasKey('user_id', $user->toArray());

		$user->user_name = 'updateUser';
		$umapper->update($user);

		// DBに保存されているかどうかを調べる
		$user = $umapper->find($user->user_id);
		$this->assertSame('updateUser', $user->user_name);
	}

    public function testDeleteUser() {
        $user = getUserInstance('deleteUser');
        $umapper = new UserMapper(self::$pdo);

        $umapper->insert($user);
        $umapper->delete($user);
        $allUsers = $umapper->findAll()->fetchAll();

        $this->assertEmpty($allUsers);
    }

	public function testFindUser(){
		$userName = "forFindUser";
		$user = getUserInstance($userName);
		$umapper = new UserMapper(self::$pdo);

		$umapper->insert($user);
		$newUser = $umapper->find($user->user_id);
		$this->assertEquals($userName, $newUser->user_name);
	}

	public function testFindAllUser(){
		$userName = "forFindUser";
		$userName2 = "forFindUser2";
		$user = getUserInstance($userName);
		$user2 = getUserInstance($userName2);
		$users = array();
		array_push($users, $user, $user2);

		$umapper = new UserMapper(self::$pdo);

		$umapper->insert($users);
		$newUsers = $umapper->findAll()->fetchAll();
		$this->assertEquals(2, count($newUsers));
	}

	public function testFindByName(){
		$userName = "forFindByNameUser";
		$userName2 = "otherUser";
		$user = getUserInstance($userName);
		$user2 = getUserInstance($userName2);
		$umapper = new UserMapper(self::$pdo);

		$umapper->insert($user);
		$umapper->insert($user2);
		$newUser = $umapper->findByName($user->user_name);
		$this->assertEquals($newUser->user_name, $userName);
	}

}


