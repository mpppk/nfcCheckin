$(function() {
    var tempLoginUserID = 1;
    var pageController = {
        __name: 'PageController',
        _helloWorldController: helloWorldController,
        _logsController: logsController,
        _userController: userController,
        _drawerController: drawerController,
        _navController: navController,
        _loginController: loginController,
        _calendarController: calendarController,
        _LOCAController: LOCAController,
        _deviceController: deviceController,

        serverIP: 'http://' + location.host + ':' + location.port,

        mySocket: io.connect(this.serverIP),
        // mySocket: io.connect('http://192.168.33.10:3000'),
        // mySocket: io.connect('http://192.168.33.10:3000'),
        // helloSocket: io.connect('http://192.168.33.10:3000'),
        __meta:{
            _helloWorldController:{
                rootElement: '#container'
            },
            _logsController:{
        		rootElement: '#logs'
        	},
            _userController:{
                rootElement: '#user'
            },
            _drawerController:{
                rootElement: '#sidr'
            },
            _navController:{
                rootElement: '#navbar'
            },
            _loginController:{
                rootElement: '#login'
            },
            _calendarController:{
                rootElement: '#calendar'
            },
            _LOCAController:{
                rootElement: '#loca'
            },
            _deviceController:{
                rootElement: '#device'
            }

        },
        __ready: function(){
            var self = this;
            this.hideWithout(this._logsController);
            this.mySocket.on('syncRequestResponse', function(isSuccess){
                if(isSuccess){
                    self._deviceController.startSync();
                }else{
                    self._deviceController.syncFailued();
                }
            });

            // 誰かがデバイスをsyncした場合(まだデバイス名は決めていない状態)
            this.mySocket.on('deviceFound', function(json){
                // jsonの中身
                // cardName, checkinNum, userName, IDm, checkinTime

                self._deviceController.detectDevice(json);
            });

            // 誰かがデバイスを追加した場合(デバイス名が決定された状態)
            this.mySocket.on('updateUser', function(json){
                // this.jsonの中身
                // cardName, checkinNum, userName, IDm, checkinTime
                if(tempLoginUserID == json.userID){
                    self._logsController.updateUser(json);
                }
            });

            this.mySocket.on('LOCAChanged', function(data){
                if(tempLoginUserID == data.userID){
                    self._LOCAController.updateTable(data);
                }
            });

            // var self = this;
            // pageController.mySocket.on('addLog', function(){
            //     self.addLog(data);
            // });
        },
        load: function(){
            this._logsController.load();
        },
        addLog: function(data){
            console.log('posted json: ' + data);
            this._logsController.addLog(data);
        },
        '{rootElement} moveToLogs': function(){
            this.hideWithout(this._logsController);
            $.sidr('close', 'sidr');
            this._navController.changeTitle('使用履歴');
            // ログ画面以外のDOM要素を隠す処理
        },
        '{rootElement} moveToStatus': function(){
            $.sidr('close', 'sidr');
            this._userController.load(tempLoginUserID);
            this.hideWithout(this._userController);
            this._navController.changeTitle('ユーザー情報');
        },
        '{rootElement} moveToLOCA': function(){
            this.hideWithout(this._LOCAController);
            $.sidr('close', 'sidr');
            this._navController.changeTitle('LOCA情報');
        },
        // '{rootElement} moveToPayment': function(){
        //     this.hideWithout(this._paymentController);
        //     $.sidr('close', 'sidr');
        //     this._navController.changeTitle('Payment');
        // },
        // '{rootElement} moveToDeposit': function(){
        //     this.hideWithout(this._depositController);
        //     $.sidr('close', 'sidr');
        //     this._navController.changeTitle('Deposit');
        // },
        '{rootElement} moveToLogin': function(){
            this.hideWithout(this._loginController);
            this._navController.changeTitle('ログイン');
        },
        '{rootElement} moveToCalendar': function(){
            this.hideWithout(this._calendarController);
            $.sidr('close', 'sidr');
            this._navController.changeTitle('カレンダー');
        },
        '{rootElement} moveToDevice': function(){
            this._deviceController.load(tempLoginUserID);
            this.hideWithout(this._deviceController);
            $.sidr('close', 'sidr');
            this._navController.changeTitle('カード情報');
        },

        hideWithout: function(controller){// 引数に指定した要素以外の各ページに対応するDOM要素を全部隠す
            this._logsController.hide();
            this._userController.hide();
            this._calendarController.hide();
            this._loginController.hide();
            this._deviceController.hide();
            this._LOCAController.hide();
            controller.show();
        }
    };

    // pageController.helloSocket.on('emit_from_server', function(data){
    //     console.log(data);
    // });

    // pageController.mySocket.on('emit_from_server', function(){
    //     pageController.load();
    //     pageController._logsController.load();
    // });
    
    h5.core.controller('body', pageController );

    pageController.mySocket.on('touched', function(data){
        pageController._logsController.addLog(data);
    });
});

