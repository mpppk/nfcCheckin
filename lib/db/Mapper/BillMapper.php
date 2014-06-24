<?php
require_once (dirname(__FILE__) . "/DataMapper.php");

class BillMapper extends DataMapper{
    const MODEL_CLASS = 'Bill';

    // ------------- 更新系クエリ -----------------

    /**
     * Model\Userか、Model\Userの配列を引数に取り、全部DBにinsertします。
     *
     */
    function insert($data) {
        $pdo = $this->_pdo;
        $modelClass = self::MODEL_CLASS;

        $stmt = $pdo->prepare('
            INSERT INTO Bills(bill_name, user_id, price, datetime)
            VALUES (?, ?, ?, ?)
        ');
        $stmt->bindParam(1, $billName,   PDO::PARAM_STR);
        $stmt->bindParam(2, $userID, PDO::PARAM_INT);
        $stmt->bindParam(3, $price, PDO::PARAM_INT);
        $stmt->bindParam(4, $datetime, PDO::PARAM_STR);

        if (! is_array($data)) {
            $data = array($data);
        }
        foreach ($data as $row) {
            if (! $row instanceof $modelClass || ! $row->isValid()) {
                throw new InvalidArgumentException;
            }
            $billName = $row->bill_name;
            $userID = $row->user_id;
            $price = $row->price;
            $datetime = $row->datetime;
            $stmt->execute();

            //autoincrementな主キーをオブジェクト側へ反映
            $row->bill_id = $pdo->lastInsertId();
        }
    }

    function update($data){
        $modelClass = self::MODEL_CLASS;

        $stmt = $this->_pdo->prepare('
            UPDATE Bills
               SET bill_name = ?
                 , user_id = ?
                 , price = ?
                 , datetime = ?
             WHERE bill_id = ?
        ');
        $stmt->bindParam(1, $billName,  PDO::PARAM_STR);
        $stmt->bindParam(2, $userID,   PDO::PARAM_STR);
        $stmt->bindParam(3, $price,   PDO::PARAM_STR);
        $stmt->bindParam(4, $datetime, PDO::PARAM_STR);
        $stmt->bindParam(5, $billID, PDO::PARAM_INT);

        if (! is_array($data)) {
            $data = array($data);
        }
        foreach ($data as $row) {
            if (! $row instanceof $modelClass || ! $row->isValid()) {
                throw new InvalidArgumentException;
            }
            $billID = $row->bill_id;
            $billName  = $row->bill_name;
            $userID   = $row->user_id;
            $price = $row->price;
            $datetime   = $row->datetime;
            $stmt->execute();

        }
    }

    function delete($data){
        $modelClass = self::MODEL_CLASS;

        $stmt = $this->_pdo->prepare('
            DELETE FROM Bills
             WHERE bill_id = ?
        ');
        $stmt->bindParam(1, $billID, PDO::PARAM_INT);

        if (! is_array($data)) {
            $data = array($data);
        }
        foreach ($data as $row) {
            if (! $row instanceof $modelClass) {
                throw new InvalidArgumentException;
            }
            $billID = $row->bill_id;
            $stmt->execute();
        }
    }

    //------------- 参照系クエリ ----------------

    function find($billID){
        $stmt = $this->_pdo->prepare('
            SELECT *
              FROM Bills
             WHERE bill_id = ?
        ');
        $stmt->bindParam(1, $billID, PDO::PARAM_INT);
        $stmt->execute();

        $this->_decorate($stmt);
        return $stmt->fetch(PDO::FETCH_CLASS);
    }

    function findAll(){
        $stmt = $this->_pdo->query('
            SELECT *
              FROM Bills
        ');
        return $this->_decorate($stmt);
    }
}

