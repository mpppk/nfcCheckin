<?php
$rootPass = dirname(__FILE__). '/../../';
// require_once 'PHPUnit/Autoload.php';
require_once $rootPass. 'lib/db/Mapper/CheckinLogMapper.php';
require_once $rootPass. 'lib/db/Model/CheckinLog.php';
require_once $rootPass. 'lib/db/dbfunctions.php';

function getLogInstance($idmId = 1){
	$log = new CheckinLog;
	$log->idm_id = $idmId;
	return $log;
}

class DBFacade{
	static $pdo;

	// シングルトンにする
	private static $instance = null;
 
    private function __construct(){
    }
 
    public static function I($arg_pdo){
        if (is_null(self::$instance)){
            self::$instance = new self;
        }
	 	self::$pdo = $arg_pdo;
        return self::$instance;
    }

	// テスト開始時にテスト用のDBに接続する
	static function init(){
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

	public function checkin($idmNo){
		$cmapper = new CheckinLogMapper(self::$pdo);
		$imapper = new IDmMapper(self::$pdo);

		// 受け取ったidmNoがIDmsに存在するかチェック
		// 存在しなければあたらしくidmを登録する
		if(!$imapper->hasIDmNo($idmNo)){
			$idm = new IDm;
			$idm->idm_no = $idmNo;
			$imapper->insert($idm);
		}else{
			$idm = $imapper->findByIDm($idmNo);
		}

		// Logを追加
		$log = new CheckinLog;
		$log->idm_id = $idm->idm_id;
		$cmapper->insert($log);
	}
}
