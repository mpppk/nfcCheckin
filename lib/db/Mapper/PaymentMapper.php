<?php
require_once (dirname(__FILE__) . "/DataMapper.php");

class PaymentMapper extends DataMapper{
    const MODEL_CLASS = 'Payment';

    // ------------- 更新系クエリ -----------------

    /**
     * Model\Userか、Model\Userの配列を引数に取り、全部DBにinsertします。
     *
     */
    function insert($data) {
        $pdo = $this->_pdo;
        $modelClass = self::MODEL_CLASS;

        $stmt = $pdo->prepare('
            INSERT INTO Payments(payment_name, user_id, price, datetime)
            VALUES (?, ?, ?, ?)
        ');
        $stmt->bindParam(1, $paymentName,   PDO::PARAM_STR);
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
            $paymentName = $row->payment_name;
            $userID = $row->user_id;
            $price = $row->price;
            $datetime = $row->datetime;
            $stmt->execute();

            //autoincrementな主キーをオブジェクト側へ反映
            $row->payment_id = $pdo->lastInsertId();
        }
    }

    function update($data){
        $modelClass = self::MODEL_CLASS;

        $stmt = $this->_pdo->prepare('
            UPDATE Payments
               SET payment_name = ?
                 , user_id = ?
                 , price = ?
                 , datetime = ?
             WHERE payment_id = ?
        ');
        $stmt->bindParam(1, $paymentName,  PDO::PARAM_STR);
        $stmt->bindParam(2, $userID,   PDO::PARAM_STR);
        $stmt->bindParam(3, $price,   PDO::PARAM_STR);
        $stmt->bindParam(4, $datetime, PDO::PARAM_STR);
        $stmt->bindParam(5, $paymentID, PDO::PARAM_INT);

        if (! is_array($data)) {
            $data = array($data);
        }
        foreach ($data as $row) {
            if (! $row instanceof $modelClass || ! $row->isValid()) {
                throw new InvalidArgumentException;
            }
            $paymentID = $row->payment_id;
            $paymentName  = $row->payment_name;
            $userID   = $row->user_id;
            $price = $row->price;
            $datetime   = $row->datetime;
            $stmt->execute();

        }
    }

    function delete($data){
        $modelClass = self::MODEL_CLASS;

        $stmt = $this->_pdo->prepare('
            DELETE FROM Payments
             WHERE payment_id = ?
        ');
        $stmt->bindParam(1, $paymentID, PDO::PARAM_INT);

        if (! is_array($data)) {
            $data = array($data);
        }
        foreach ($data as $row) {
            if (! $row instanceof $modelClass) {
                throw new InvalidArgumentException;
            }
            $paymentID = $row->payment_id;
            $stmt->execute();
        }
    }

    //------------- 参照系クエリ ----------------

    function find($paymentID){
        $stmt = $this->_pdo->prepare('
            SELECT *
              FROM Payments
             WHERE payment_id = ?
        ');
        $stmt->bindParam(1, $paymentID, PDO::PARAM_INT);
        $stmt->execute();

        $this->_decorate($stmt);
        return $stmt->fetch(PDO::FETCH_CLASS);
    }

    function findAll(){
        $stmt = $this->_pdo->query('
            SELECT *
              FROM Payments
        ');
        return $this->_decorate($stmt);
    }
}

