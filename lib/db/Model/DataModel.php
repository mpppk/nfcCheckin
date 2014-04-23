<?php
abstract class DataModel
{
    const
        BOOLEAN = 'boolean'
      , INTEGER = 'integer'
      , DOUBLE  = 'double'
      , FLOAT   = 'double'
      , STRING  = 'string'
      , DATETIME = 'dateTime'
      ;

    // プロパティの値
    protected $_data = array();

    // 継承先のクラスが持つプロパティの型(上記constで定義されたいずれか)
    protected static $_schema = array();

    // schemaのプロパティにアクセスした場合の挙動を定義
    function __get($prop) {
        // プロパティの値を返す
        if (isset($this->_data[$prop])) {
            return $this->_data[$prop];
        // 継承先のクラスが持つプロパティとしては定義されているが、値は設定されていない場合
        } elseif (isset(static::$_schema[$prop])) {
            return null;
        // どちらでもない場合は例外
        } else {
            throw new InvalidArgumentException;
        }
    }

    // プロパティの値が入っているか
    function __isset($prop) {
        return isset($this->_data[$prop]);
    }

    // プロパティに値を代入する処理
    function __set($prop, $val) {
        // 指定されたプロパティが存在しない場合
        if (!isset(static::$_schema[$prop])) {
            throw new InvalidArgumentException($prop.'はセットできません');
        }

        // 指定されたプロパティの型を取得
        $schema = static::$_schema[$prop];
        // 代入予定の値の型を取得
        $type = gettype($val);

        // 指定されたプロパティの型がDATETIMEである時の処理
        if ($schema === self::DATETIME) {
            if ($val instanceof DateTime) {
                $this->_data[$prop] = $val;
            } else {
                $this->_data[$prop] = new DateTime($val);
            }
            return;
        }

        // 代入される予定の値が、プロパティの型とあっている場合はそのまま代入
        if ($type === $schema) {
            $this->_data[$prop] = $val;
            return;
        }

        // それぞれの型にキャストする
        switch ($schema) {
            case self::BOOLEAN:
                return $this->_data[$prop] = (bool)$val;
            case self::INTEGER:
                return $this->_data[$prop] = (int)$val;
            case self::DOUBLE:
                return $this->_data[$prop] = (double)$val;
            case self::STRING:
            default:
                return $this->_data[$prop] = (string)$val;
        }
    }

    function toArray() {
        return $this->_data;
    }

    function fromArray(array $arr) {
        foreach ($arr as $key => $val) {
            $this->__set($key, $val);
        }
    }

    abstract function isValid();
}