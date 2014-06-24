<?php
require_once (dirname(__FILE__) . "/DataModel.php");

/**
 * ユーザを表すモデル
 *
 * @group model
 */
class User extends DataModel{
    
    protected static $_schema = array(
        'deposit_id'   => parent::INTEGER
      , 'deposit_name'    => parent::STRING
      , 'user_id'     => parent::INTEGER
      , 'price'     => parent::INTEGER
      , 'datetime'     => parent::STRING
    );

    function isValid(){
    }
}
?>
