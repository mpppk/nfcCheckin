<?php
require_once (dirname(__FILE__) . "/DataModel.php");

/**
 * 
 * チェックイン情報を表すクラス
 * @group model
 */
class CheckinLog extends DataModel{
    protected static $_schema = array(
        'checkin_id'   => parent::INTEGER
      , 'idm_id'    => parent::INTEGER
      , 'checkin_time'     => parent::STRING
      , 'modified'     => parent::STRING
    );

    function isValid(){
        return true;
    }
}

