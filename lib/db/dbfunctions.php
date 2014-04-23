<?php
// require_once (dirname(__FILE__) . "/dbfuncs.php");
$rootPass = dirname(__FILE__). '/../../';

function getPDO($env=null) {
    static $pdo = array();
    global $rootPass;

    if (! isset($pdo[$env])) {
        if ($env) {
            $conf = require $rootPass. "conf/db.$env.conf.php";
        } else {
            $conf = require $rootPass. "conf/db.conf.php";
        }
        $pdo[$env] = new PDO(
            $conf['dsn'],
            $conf['user'],
            $conf['pass'],
            array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_CLASS,
            )
        );
        //SQLiteで外部キー制約を有効にする
        // $pdo[$env]->query('PRAGMA foreign_keys = ON');
    }

    return $pdo[$env];
}

// 主キーが１つのもののみ
// function getTableValue($tableName, $columnName, $primaryColumn, $primaryValue) {
// 	$dbh = connectDB();
// 	$sql = "SELECT * FROM `$tableName` WHERE $primaryColumn = '$primaryValue'";
// 	//var_dump($sql);
// 	$res = array();
// 	foreach ($dbh->query($sql) as $row) {
// 		array_push($res, $row[$columnName]);
// 	}
// 	return $res[0];
// }

?>