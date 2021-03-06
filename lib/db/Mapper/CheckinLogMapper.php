<?php
$rootPass = dirname(__FILE__). '/../../../';
require_once ($rootPass. "lib/db/Mapper/DataMapper.php");
require_once ($rootPass. "lib/db/Mapper/IDmMapper.php");

class CheckinLogMapper extends DataMapper{
    const MODEL_CLASS = 'CheckinLog';

    public function delete($arg_checkinIds){
        $stmt = $this->_pdo->prepare('
            DELETE FROM CheckinLogs
             WHERE checkin_id = ?
        ');
        $stmt->bindParam(1, $checkinId, PDO::PARAM_INT);

        if (! is_array($arg_checkinIds)) {
            $arg_checkinIds = array($arg_checkinIds);
        }
        foreach ($arg_checkinIds as $arg_checkinId) {
            $checkinId = $arg_checkinId;
            $stmt->execute();
        }
    }

    public function find($checkinId){
        $stmt = $this->_pdo->prepare('
            SELECT *
              FROM CheckinLogs
              WHERE checkin_id = ?
        ');
        $stmt->bindParam(1, $checkinId, PDO::PARAM_INT);
        $stmt->execute();

        $this->_decorate($stmt);
        return $stmt->fetch(PDO::FETCH_CLASS);
    }

    public function findByIDmId($idmId){
        $stmt = $this->_pdo->prepare('
            SELECT *
              FROM CheckinLogs
              WHERE idm_id = ?
        ');
        $stmt->bindParam(1, $idmId, PDO::PARAM_INT);
        $stmt->execute();

        $this->_decorate($stmt);
        return $stmt->fetch(PDO::FETCH_CLASS);
    }

    public function findByIDmNo($idmNo){
        $imapper = new IDmMapper($this->_pdo);
        $idm = $imapper->findByIDm($idmNo);
        $stmt = $this->_pdo->prepare('
            SELECT *
              FROM CheckinLogs
              WHERE idm_id = ?
        ');
        $stmt->bindParam(1, $idmId, PDO::PARAM_INT);
        $idmId = $idm->idm_id;
        $stmt->execute();

        $this->_decorate($stmt);
        return $stmt->fetch(PDO::FETCH_CLASS);
    }

    public function findAllByDate($date){
        $stmt = $this->_pdo->prepare("
            SELECT *
              FROM CheckinLogs
              WHERE date(checkin_time) = date(?)
        ");

        $stmt->bindParam(1, $date, PDO::PARAM_STR);
        $stmt->execute();

        $this->_decorate($stmt);
        return $stmt->fetchAll(PDO::FETCH_CLASS);
    }

    public function findAll(){
        $stmt = $this->_pdo->query('
            SELECT *
              FROM CheckinLogs
        ');
        return $this->_decorate($stmt);
    }

    public function insert($data){
        $pdo = $this->_pdo;
        $modelClass = self::MODEL_CLASS;

        $stmt = $pdo->prepare('
            INSERT INTO CheckinLogs(idm_id, checkin_time, modified)
            VALUES (?, ?, ?)
        ');
        $stmt->bindParam(1, $idmId,   PDO::PARAM_INT);
        $stmt->bindParam(2, $checkinTime,   PDO::PARAM_STR);
        $stmt->bindParam(3, $modified, PDO::PARAM_STR);

        if (! is_array($data)) {
            $data = array($data);
        }

        $logs = array();
        foreach ($data as $row) {
            $row->checkin_time = date('Y-m-d H:i:s');
            $row->modified = date('Y-m-d H:i:s');

            $idmId = $row->idm_id;
            $checkinTime = $row->checkin_time;
            $modified = $row->modified;
            $stmt->execute();

            array_push($logs, $row);
        }

        //autoincrementな主キーをオブジェクト側へ反映
        $row->checkin_id = $pdo->lastInsertId();
    }

    public function changeCheckinTime($data){
        $modelClass = self::MODEL_CLASS;

        $stmt = $this->_pdo->prepare('
            UPDATE CheckinLogs
               SET checkin_time = ?
                 , modified = ?
             WHERE checkin_id = ?
        ');
        $stmt->bindParam(1, $checkinTime,  PDO::PARAM_STR);
        $stmt->bindParam(2, $modified,   PDO::PARAM_STR);
        $stmt->bindParam(3, $checkinId, PDO::PARAM_INT);

        if (! is_array($data)) {
            $data = array($data);
        }
        foreach ($data as $row) {
            if (! $row instanceof $modelClass || ! $row->isValid()) {
                throw new InvalidArgumentException;
            }
            $checkinTime = $row->checkin_time;
            $modified = date('Y-m-d H:i:s');
            $checkinId = $row->checkin_id;
            $stmt->execute();
        }
    }
}
