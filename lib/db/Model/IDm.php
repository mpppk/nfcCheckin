<?php
require_once (dirname(__FILE__) . "/DataModel.php");

/**
 * IDmに紐づけられた情報を表すモデル
 *
 * @group model
 */
class IDm extends DataModel{
    protected static $_schema = array(
        'idm_id'   => parent::INTEGER
      , 'user_id'    => parent::INTEGER
      , 'idm_no'     => parent::INTEGER
    );

    function isValid(){
        return true;
    }
}
