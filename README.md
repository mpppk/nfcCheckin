# ひつようなもの
## nfcpyの依存ファイル
-Python 2.6 or newer but not Python 3.x
-pyUSB and libusb (for native USB readers)
-pySerial (for serial readers on COM or USB)

## らいぶらり
-php
-phpunit
-python
-sqlite3

# そのた
PaSoRi(Amazonとかで買ってね)

# どうにゅう

```Shell
git clone https://github.com/mpppk/nfcCheckin.git
cd nfcCheckin/data
cp test.db.org test.db
```

# つかいかた
注)まだちゃんと動かないので、testオプション必須です

```Shell
cd ../lib
sudo php nfcCheckinMain.php --test
```

nfcpyが動かないけど本体の挙動を確かめたいときは--mockオプションを付けてください
mock.pyを読み込むようになります。


