<?php
require_once (dirname(__FILE__) . "/DataModel.php");

/**
 * LOCAの入出金情報を表すモデル
 *
 * @group model
 */
class LOCALog extends DataModel{
    
    protected static $_schema = array(
        'loca_id'   => parent::INTEGER
      , 'name'    => parent::STRING
      , 'user_id'     => parent::INTEGER
      , 'price'     => parent::INTEGER
      , 'datetime'     => parent::STRING
      , 'type'     => parent::STRING
    );

    function isValid(){
        return true;
    }
}
?>
