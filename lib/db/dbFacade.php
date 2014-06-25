<?php
$rootPass = dirname(__FILE__). '/../../';
// require_once 'PHPUnit/Autoload.php';
require_once $rootPass. 'lib/db/Mapper/CheckinLogMapper.php';
require_once $rootPass. 'lib/db/Model/CheckinLog.php';
require_once $rootPass. 'lib/db/Model/IDm.php';
require_once $rootPass. 'lib/db/dbfunctions.php';
require_once $rootPass. 'lib/db/Mapper/IDmMapper.php';

// function getLogInstance($idmId = 1){
// 	$log = new CheckinLog;
// 	$log->idm_id = $idmId;
// 	return $log;
// }

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
		return $log;
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
			  IDms.user_id = Users.user_id
			ORDER BY checkin_time DESC;
		');
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function findAllLogByUser($userID){
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
			  IDms.user_id = Users.user_id
			WHERE Users.user_id = ?
			ORDER BY checkin_time DESC;
		');
		$stmt->bindParam(1, $userID, PDO::PARAM_INT);
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getAllLog(){
		$result = $this->findAllWithUser();
		return $result;
	}

	public function findUserByDate($date){
		$stmt = self::$pdo->query('
			SELECT
			  *
			FROM
			  CheckinLogs
			LEFT JOIN
			  IDms
			ON 
			  CheckinLogs.idm_id = IDms.idm_id
			LEFT JOIN
			  Users
			ON
			  IDms.user_id = Users.user_id
			WHERE
			  date(checkin_time) = date(?);
		');

		$stmt->bindParam(1, $date, PDO::PARAM_STR);
		$stmt->execute();
		// $this->_decorate($stmt);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function findLOCALogByUserID($userID){
		$stmt = self::$pdo->query('
			SELECT
			  *
			FROM
			  Payments
			WHERE
			  Payments.user_id = ?
			UNION
			SELECT
			  *
			FROM
			  Deposits
			WHERE
			  Deposits.user_id = ?
			ORDER BY datetime DESC;
		');

		$stmt->bindParam(1, $userID, PDO::PARAM_STR);
		$stmt->bindParam(2, $userID, PDO::PARAM_STR);
		$stmt->execute();
		// $this->_decorate($stmt);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

}
