<?php
require_once (dirname(__FILE__) . "/DataModel.php");

/**
 * ユーザを表すモデル
 *
 * @group model
 */
class User extends DataModel{
    protected static $_schema = array(
        'user_id'   => parent::INTEGER
      , 'user_name'    => parent::STRING
      , 'mail_address'     => parent::STRING
      , 'profile'   => parent::STRING
      , 'coin' => parent::INTEGER
    );

    function isValid(){
        // userNameは255文字まで、必須
        $val = $this->user_name;
        if (empty($val) || !mb_check_encoding($val) || mb_strlen($val) > 255) {
            echo "user_nameが正しい値ではありません";
            return false;
        }

        // mailaddressは255文字まで、必須
        $val = $this->mail_address;
        if (empty($val) || !mb_check_encoding($val) || mb_strlen($val) > 255) {
            echo "user_nameが正しい値ではありません";
            return false;
        }

        // profileは511字まで、必須
        $val = $this->profile;
        if (empty($val) || !mb_check_encoding($val) || mb_strlen($val) > 511) {
            echo "profileが正しい値ではありません";
            return false;
        }

        return true;
    }
}

?>