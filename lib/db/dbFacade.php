<?php
$rootPass = dirname(__FILE__). '/../../';
// require_once 'PHPUnit/Autoload.php';
require_once $rootPass. 'lib/db/Mapper/CheckinLogMapper.php';
require_once $rootPass. 'lib/db/Model/CheckinLog.php';
require_once $rootPass. 'lib/db/Model/IDm.php';
require_once $rootPass. 'lib/db/dbfunctions.php';
require_once $rootPass. 'lib/db/Mapper/IDmMapper.php';

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

	// チェックインしているすべてのユーザ名とチェックイン時間を取得
    public function findAllWithUser(){
        $stmt = self::$pdo->query('
            SELECT
              user_name,
              checkin_time
            FROM
              CheckinLogs
            LEFT JOIN
              IDms
            ON 
              CheckinLogs.idm_id = IDms.idm_id
            LEFT JOIN
              Users
            ON
              IDms.user_id = Users.user_id;
        ');
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

	public function getAllLog(){
		$result = $this->findAllWithUser();
		return $result;
	}
}
