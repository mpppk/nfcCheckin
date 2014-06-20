<?php
$rootPass = dirname(__FILE__). '/../';
// require_once 'PHPUnit/Autoload.php';
require_once $rootPass. 'lib/db/Mapper/IDmMapper.php';
require_once $rootPass. 'lib/db/Model/IDm.php';
require_once $rootPass. 'lib/db/dbfunctions.php';

// 指定したパラメータのidmインスタンスを返す
function getIDmInstance($arg_userId = 1, $arg_idmNo = 12345, $arg_cardName = 'testCardName'){
	$idm = new IDm;
	$idm->user_id = $arg_userId;
	$idm->idm_no = $arg_idmNo;
	$idm->card_name = $arg_cardName;
	return $idm;
}

class IDmMapperTest extends PHPUnit_Framework_TestCase{
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
        $pdo->commit();
    }

	public function testInsertIDm(){
		$imapper = new IDmMapper(self::$pdo);
		$idm = getIDmInstance();
		$imapper->insert($idm);
		// phpは、オブジェクトを参照渡しするので、insert後のuserオブジェクトをチェックすればよい
		$this->assertArrayHasKey('idm_id', $idm->toArray());
	}

	public function testUpdateIDm(){
		$imapper = new IDmMapper(self::$pdo);
		$idm = getIDmInstance();
		$imapper->insert($idm);

		// phpは、オブジェクトを参照渡しするので、insert後のuserオブジェクトをチェックすればよい
		$this->assertArrayHasKey('idm_id', $idm->toArray());

		$idm->user_id = 2;
		$imapper->update($idm);

		// DBに保存されているかどうかを調べる
		$newIdm = $imapper->find($idm->idm_id);
		$this->assertSame($idm->idm_no, $newIdm->idm_no);
	}

    public function testDeleteIDm() {
        $idm = getIDmInstance();
        $imapper = new IDmMapper(self::$pdo);

        $imapper->insert($idm);
        $imapper->delete($idm->idm_id);
        $allIdms = $imapper->findAll()->fetchAll();

        $this->assertEmpty($allIdms);
    }

	public function testFindIDm(){
		$idm = getIDmInstance();
		$imapper = new IDmMapper(self::$pdo);

		$imapper->insert($idm);
		$newIdm = $imapper->find($idm->idm_id);
		$this->assertEquals($idm->idm_no, $newIdm->idm_no);
	}

	public function testFindAllIDm(){
		$idm = getIDmInstance(1);
		$idm2 = getIDmInstance(2,67890);
		$idms = array();
		array_push($idms, $idm, $idm2);

		$imapper = new IDmMapper(self::$pdo);

		$imapper->insert($idms);
		$newIDms = $imapper->findAll()->fetchAll();
		$this->assertEquals(2, count($newIDms));
	}

	// 指定したユーザIDを持つIDmインスタンスが正しく返されるかのテスト
	public function testFindAllIDmByUserId(){
		$idms = array();
		$idm = getIDmInstance(1);
		$idm2 = getIDmInstance(2, 67890);
		$idm3 = getIDmInstance(1, 98765);
		array_push($idms, $idm, $idm2, $idm3);
		$imapper = new IDmMapper(self::$pdo);
		$imapper->insert($idms);
		$newIdm = $imapper->findAllIDmByUserId(1);
		$this->assertEquals(2, count($newIdm));
	}

	// 指定したIDmを持つIDmインスタンスが正しく返されるかのテスト
	public function testFindByIDm(){
		$idm = getIDmInstance(1);
		$imapper = new IDmMapper(self::$pdo);
		$imapper->insert($idm);
		$newIdm = $imapper->findByIDm(12345);
		$this->assertEquals($idm->idm_no, $newIdm->idm_no);
		echo 'card name is '. $idm->card_name;
		echo 'card name is '. $newIdm->card_name;
	}

	// 指定したIDmを持っている場合、hasIDmが正しく動作するかのテスト
	public function testHasIDmNo(){
		$idm = getIDmInstance(1);
		$imapper = new IDmMapper(self::$pdo);
		$imapper->insert($idm);
		$this->assertEquals(true, $imapper->hasIDmNo($idm->idm_no));
		$this->assertEquals(false, $imapper->hasIDmNo('jkdsf'));
	}

}
