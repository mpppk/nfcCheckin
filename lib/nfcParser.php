<?php 
function tagToolsParser($str){
	// $retStr = exec('python tagTools.py');
	// echo $retStr;
	$params = explode(' ', $str);

	$paramArr = array();
	foreach ($params as $param) {
		$keyAndVal = explode('=', $param);
		if(count($keyAndVal) == 1) continue;
		$paramArr += array($keyAndVal[0] => $keyAndVal[1]);
	}
	return $paramArr;
}
?>
