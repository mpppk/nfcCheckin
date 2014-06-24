<?php
require_once (dirname(__FILE__) . "/DataModel.php");

/**
 * ユーザを表すモデル
 *
 * @group model
 */
class Bill extends DataModel{
    
    protected static $_schema = array(
        'bill_id'   => parent::INTEGER
      , 'bill_name'    => parent::STRING
      , 'user_id'     => parent::INTEGER
      , 'price'     => parent::INTEGER
      , 'datetime'     => parent::STRING
    );

    function isValid(){
        return true;
    }
}
?>
