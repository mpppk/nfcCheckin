<?php
$rootPass = dirname(__FILE__). '/../../';
require_once $rootPass. 'lib/db/dbfunctions.php';
require_once $rootPass. 'lib/db/Model/User.php';
require_once $rootPass. 'lib/db/Mapper/UserMapper.php';
$pdo = getPDO('test');
$umapper = new UserMapper($pdo);
$user = $umapper->find( (int)$argv[1] );
$result = array();

$result += array('userId' => $user->user_id);
$result += array('userName' => $user->user_name);
$result += array('mailAddress' => $user->mail_address);
$result += array('password' => $user->password);
$result += array('profile' => $user->profile);
$result += array('coin' => $user->coin);

header("Content-Type: application/json; charset=utf-8");
echo json_encode($result);

