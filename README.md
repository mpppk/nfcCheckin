# NFC-Checkinとは
NFC-Checkinは、NFCを用いた入室管理を可能にするシステムです。ICカードをリーダーにかざすだけで入室処理が完了します。利用にはSUICA、ICOCAなどの交通系カード、免許証、学生証、スマートフォンなど、種類に限らずあらゆるICカードを統一的に扱うことができます。  またNFC-Checkinの機能を拡張するLOCAというプラグインを準備しました。これはNFC-Checkinで利用しているICカードにローカルな電子マネー機能を付与し、ユーザ間の面倒な金銭のやり取りを排除するためのプラグインです。 入室や支払いのログはNFC-CheckinのDBに保存されます。  
これらのデータは、NFC-Checkinが提供するwebアプリケーションからアクセスし、追加、変更が可能です。NFC-Checkinが設置された場所のローカルネットワーク内ならどの端末からでもwebアプリケーションにアクセスできます。  
詳細は以下のURLから確認してください。  
http://www6063ue.sakura.ne.jp/nfccheckin/wordpress/

# 必要なもの
## ハードウェア
* Linuxマシン
* PaSorRi(icカードリーダー)
* webカメラ(貯金箱入金機能を利用する場合のみ)

## 依存ライブラリ
* php5
* php5-sqlite
* sqlite
* Node.js
* npm
* opencv(貯金箱機能を利用する場合のみ)

## nfcpyの依存ライブラリ
* Python 2.6 or newer but not Python 3.x
* pyUSB and libusb (for native USB readers)
* pySerial (for serial readers on COM or USB)

# 導入

```Shell
git clone https://github.com/mpppk/nfcCheckin.git
cd nfcCheckin
cp data/sample.db.org data/sample.db
npm install
```

# 実行
```Shell
sudo php nfcCheckin/lib/nfcCheckinMain.php sample // icカードを待ち受けるプログラム
node app.js // サーバの立ち上げ　3000番ポートで待ち受ける nfcCheckinMain.phpと別のターミナルで同時に実行する
```

nfcpyが動かないけど本体の挙動を確かめたいときはnfcCheckinMain.phpに--mockオプションを付けてください  
mock.pyを読み込むようになります。


