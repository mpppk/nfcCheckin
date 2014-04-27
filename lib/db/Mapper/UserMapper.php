<?php
require_once (dirname(__FILE__) . "/DataMapper.php");

class UserMapper extends DataMapper{
    const MODEL_CLASS = 'User';

    // ------------- 更新系クエリ -----------------

    /**
     * Model\Userか、Model\Userの配列を引数に取り、全部DBにinsertします。
     *
     */
    function insert($data) {
        $pdo = $this->_pdo;
        $modelClass = self::MODEL_CLASS;

        $stmt = $pdo->prepare('
            INSERT INTO Users(user_name, mail_address, profile, coin)
            VALUES (?, ?, ?, ?)
        ');
        $stmt->bindParam(1, $userName,   PDO::PARAM_STR);
        $stmt->bindParam(2, $mailaddress, PDO::PARAM_STR);
        $stmt->bindParam(3, $profile, PDO::PARAM_STR);
        $stmt->bindParam(4, $coin, PDO::PARAM_STR);

        if (! is_array($data)) {
            $data = array($data);
        }
        foreach ($data as $row) {
            if (! $row instanceof $modelClass || ! $row->isValid()) {
                throw new InvalidArgumentException;
            }
            $userName   = $row->user_name;
            $mailaddress = $row->mail_address;
            $profile = $row->profile;
            $coin = $row->coin;
            $stmt->execute();

            //autoincrementな主キーをオブジェクト側へ反映
            $row->user_id = $pdo->lastInsertId();
        }
    }

    function update($data){
        $modelClass = self::MODEL_CLASS;

        $stmt = $this->_pdo->prepare('
            UPDATE Users
               SET user_name = ?
                 , mail_address = ?
                 , profile = ?
                 , coin = ?
             WHERE user_id = ?
        ');
        $stmt->bindParam(1, $userName,  PDO::PARAM_STR);
        $stmt->bindParam(2, $mailaddress,   PDO::PARAM_STR);
        $stmt->bindParam(3, $profile, PDO::PARAM_STR);
        $stmt->bindParam(4, $coin, PDO::PARAM_STR);
        $stmt->bindParam(5, $userId, PDO::PARAM_INT);

        if (! is_array($data)) {
            $data = array($data);
        }
        foreach ($data as $row) {
            if (! $row instanceof $modelClass || ! $row->isValid()) {
                throw new InvalidArgumentException;
            }
            $userId = $row->user_id;
            $userName  = $row->user_name;
            $mailaddress   = $row->mail_address;
            $profile = $row->profile;
            $coin = $row->coin;
            $stmt->execute();
        }
    }

    function delete($data){
        $modelClass = self::MODEL_CLASS;

        $stmt = $this->_pdo->prepare('
            DELETE FROM Users
             WHERE user_id = ?
        ');
        $stmt->bindParam(1, $userId, PDO::PARAM_INT);

        if (! is_array($data)) {
            $data = array($data);
        }
        foreach ($data as $row) {
            if (! $row instanceof $modelClass) {
                throw new InvalidArgumentException;
            }
            $userId = $row->user_id;
            $stmt->execute();
        }
    }

    //------------- 参照系クエリ ----------------

    function find($userId){
        $stmt = $this->_pdo->prepare('
            SELECT *
              FROM Users
             WHERE user_id = ?
        ');
        $stmt->bindParam(1, $userId, PDO::PARAM_INT);
        $stmt->execute();

        $this->_decorate($stmt);
        return $stmt->fetch(PDO::FETCH_CLASS);
    }


    function findAll(){
        $stmt = $this->_pdo->query('
            SELECT *
              FROM Users
        ');
        return $this->_decorate($stmt);
    }

    function findByName($userName){
        $stmt = $this->_pdo->prepare('
            SELECT *
              FROM Users
             WHERE user_name = ?
        ');
        $stmt->bindParam(1, $bindUserName);
        $bindUserName = $userName;
        $stmt->execute();

        $this->_decorate($stmt);
        return $stmt->fetch(PDO::FETCH_CLASS);
    }
}