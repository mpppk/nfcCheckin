<?php
require_once (dirname(__FILE__) . "/DataMapper.php");

class IDmMapper extends DataMapper{
    const MODEL_CLASS = 'IDm';

    function delete($arg_idmIds){
        $stmt = $this->_pdo->prepare('
            DELETE FROM IDms
             WHERE idm_id = ?
        ');
        $stmt->bindParam(1, $idmId, PDO::PARAM_INT);

        if (! is_array($arg_idmIds)) {
            $arg_idmIds = array($arg_idmIds);
        }
        foreach ($arg_idmIds as $arg_idmId) {
            $idmId = $arg_idmId;
            $stmt->execute();
        }
    }

    function find($idmId){
        $stmt = $this->_pdo->prepare('
            SELECT *
              FROM IDms
              WHERE idm_id = ?
        ');
        $stmt->bindParam(1, $idmId, PDO::PARAM_INT);
        $stmt->execute();

        $this->_decorate($stmt);
        return $stmt->fetch(PDO::FETCH_CLASS);
    }

    function findAll(){
        $stmt = $this->_pdo->query('
            SELECT *
              FROM IDms
        ');
        return $this->_decorate($stmt);
    }

    function findByIDm($arg_idmNo){
        $stmt = $this->_pdo->prepare('
            SELECT *
              FROM IDms
             WHERE idm_no = ?
        ');
        $stmt->bindParam(1, $bindIdmNo, PDO::PARAM_STR);
        $bindIdmNo = $arg_idmNo;
        $stmt->execute();
        $this->_decorate($stmt);
        return $stmt->fetch(PDO::FETCH_CLASS);
    }

    function findAllIDmByUserId($userId){
        $stmt = $this->_pdo->prepare('
            SELECT *
              FROM IDms
             WHERE user_id = ?
        ');
        $stmt->bindParam(1, $bindUserId, PDO::PARAM_INT);
        $bindUserId = $userId;
        $stmt->execute();

        $this->_decorate($stmt);

        return $stmt->fetchAll(PDO::FETCH_CLASS);
    }

    function insert($data){
        $pdo = $this->_pdo;
        $modelClass = self::MODEL_CLASS;

        $stmt = $pdo->prepare('
            INSERT INTO IDms(user_id, idm_no, card_name, checkin_num)
            VALUES (?, ?, ?, ?)
        ');
        $stmt->bindParam(1, $userId,   PDO::PARAM_INT);
        $stmt->bindParam(2, $idmNo, PDO::PARAM_STR);
        $stmt->bindParam(3, $cardName, PDO::PARAM_STR);
        $stmt->bindParam(4, $checkinNum, PDO::PARAM_INT);

        if (! is_array($data)) {
            $data = array($data);
        }
        foreach ($data as $row) {
            if (! $row instanceof $modelClass || ! $row->isValid()) {
                throw new InvalidArgumentException;
            }
            $userId   = $row->user_id;
            $idmNo = $row->idm_no;
            $cardName = $row->card_name;
            $checkinNum = $row->checkin_num;
            $stmt->execute();

            //autoincrementな主キーをオブジェクト側へ反映
            $row->idm_id = $pdo->lastInsertId();
        }
    }

    function update($data){
        $modelClass = self::MODEL_CLASS;

        $stmt = $this->_pdo->prepare('
            UPDATE IDms
               SET user_id = ?
                 , idm_no = ?
                 , card_name = ?
                 , checkin_num = ?
             WHERE idm_id = ?
        ');
        $stmt->bindParam(1, $userId,  PDO::PARAM_INT);
        $stmt->bindParam(2, $idmNo,   PDO::PARAM_STR);
        $stmt->bindParam(3, $cardName, PDO::PARAM_STR);
        $stmt->bindParam(4, $checkinNum, PDO::PARAM_STR);
        $stmt->bindParam(5, $idmId, PDO::PARAM_INT);

        if (! is_array($data)) {
            $data = array($data);
        }
        foreach ($data as $row) {
            if (! $row instanceof $modelClass || ! $row->isValid()) {
                throw new InvalidArgumentException;
            }
            $userId = $row->user_id;
            $idmNo  = $row->idm_no;
            $idmId   = $row->idm_id;
            $cardName   = $row->card_name;
            $checkinNum   = $row->checkin_num;
            $stmt->execute();
        }
    }

    function hasIDmNo($idmNo){
        return $this->findByIDm($idmNo) != false;
    }
}
