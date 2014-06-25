<?php
require_once (dirname(__FILE__) . "/DataMapper.php");

class LOCALogMapper extends DataMapper{
    const MODEL_CLASS = 'LOCALog';

    // ------------- 更新系クエリ -----------------

    /**
     * Model\Userか、Model\Userの配列を引数に取り、全部DBにinsertします。
     *
     */
    function insert($data) {
        $pdo = $this->_pdo;
        $modelClass = self::MODEL_CLASS;

        $stmt = $pdo->prepare('
            INSERT INTO LOCALogs(name, user_id, price, datetime, type)
            VALUES (?, ?, ?, ?, ?)
        ');
        $stmt->bindParam(1, $name,   PDO::PARAM_STR);
        $stmt->bindParam(2, $userID, PDO::PARAM_INT);
        $stmt->bindParam(3, $price, PDO::PARAM_INT);
        $stmt->bindParam(4, $datetime, PDO::PARAM_STR);
        $stmt->bindParam(5, $type, PDO::PARAM_STR);

        if (! is_array($data)) {
            $data = array($data);
        }
        foreach ($data as $row) {
            if (! $row instanceof $modelClass || ! $row->isValid()) {
                throw new InvalidArgumentException;
            }
            $name = $row->name;
            $userID = $row->user_id;
            $price = $row->price;
            $datetime = $row->datetime;
            $type = $row->type;
            $stmt->execute();

            //autoincrementな主キーをオブジェクト側へ反映
            $row->loca_id = $pdo->lastInsertId();
        }
    }

    function update($data){
        $modelClass = self::MODEL_CLASS;

        $stmt = $this->_pdo->prepare('
            UPDATE LOCALogs
               SET name = ?
                 , user_id = ?
                 , price = ?
                 , datetime = ?
                 , type = ?
             WHERE loca_id = ?
        ');
        $stmt->bindParam(1, $name,  PDO::PARAM_STR);
        $stmt->bindParam(2, $userID,   PDO::PARAM_STR);
        $stmt->bindParam(3, $price,   PDO::PARAM_STR);
        $stmt->bindParam(4, $datetime, PDO::PARAM_STR);
        $stmt->bindParam(5, $type, PDO::PARAM_STR);
        $stmt->bindParam(6, $locaID, PDO::PARAM_INT);

        if (! is_array($data)) {
            $data = array($data);
        }
        foreach ($data as $row) {
            if (! $row instanceof $modelClass || ! $row->isValid()) {
                throw new InvalidArgumentException;
            }
            $locaID = $row->loca_id;
            $name  = $row->name;
            $userID   = $row->user_id;
            $price = $row->price;
            $datetime   = $row->datetime;
            $type   = $row->type;
            $stmt->execute();

        }
    }

    function delete($data){
        $modelClass = self::MODEL_CLASS;

        $stmt = $this->_pdo->prepare('
            DELETE FROM LOCALogs
             WHERE loca_id = ?
        ');
        $stmt->bindParam(1, $locaID, PDO::PARAM_INT);

        if (! is_array($data)) {
            $data = array($data);
        }
        foreach ($data as $row) {
            if (! $row instanceof $modelClass) {
                throw new InvalidArgumentException;
            }
            $locaID = $row->loca_id;
            $stmt->execute();
        }
    }

    //------------- 参照系クエリ ----------------

    function find($locaID){
        $stmt = $this->_pdo->prepare('
            SELECT *
              FROM LOCALogs
             WHERE loca_id = ?
        ');
        $stmt->bindParam(1, $locaID, PDO::PARAM_INT);
        $stmt->execute();

        $this->_decorate($stmt);
        return $stmt->fetch(PDO::FETCH_CLASS);
    }

    function findAllByUserID($userID){
        $stmt = $this->_pdo->prepare('
            SELECT *
              FROM LOCALogs
             WHERE user_id = ?
             ORDER BY datetime DESC;
        ');
        $stmt->bindParam(1, $userID, PDO::PARAM_INT);
        $stmt->execute();

        $this->_decorate($stmt);
        return $stmt->fetchAll(PDO::FETCH_CLASS);
    }

    function findAllOfMonth($year, $month, $type){
        $month = str_pad($month, 2, '0', STR_PAD_LEFT);
        $ym = $year. '-'. $month. '%';
        $stmt = $this->_pdo->prepare('
            SELECT *
            FROM LOCALogs
            WHERE type = ?
            AND datetime LIKE ?
            ORDER BY datetime DESC;
        ');

        $stmt->bindParam(1, $type, PDO::PARAM_STR);
        $stmt->bindParam(2, $ym, PDO::PARAM_STR);
        $stmt->execute();

        $this->_decorate($stmt);
        return $stmt->fetchAll(PDO::FETCH_CLASS);

    }

    function findAll(){
        $stmt = $this->_pdo->query('
            SELECT *
              FROM LOCALogs
        ');
        return $this->_decorate($stmt);
    }
}

