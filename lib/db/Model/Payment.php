<?php
require_once (dirname(__FILE__) . "/DataModel.php");

/**
 * ユーザを表すモデル
 *
 * @group model
 */
class Payment extends DataModel{
    
    protected static $_schema = array(
        'payment_id'   => parent::INTEGER
      , 'payment_name'    => parent::STRING
      , 'user_id'     => parent::INTEGER
      , 'price'     => parent::INTEGER
      , 'datetime'     => parent::STRING
    );

    function isValid(){
    	return true;
    }
}
?>
