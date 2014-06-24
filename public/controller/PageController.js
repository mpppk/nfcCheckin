$(function() {
    var tempLoginUserID = 1;
    var pageController = {
        __name: 'PageController',
        _helloWorldController: helloWorldController,
        _logsController: logsController,
        _userController: userController,
        _paymentController: paymentController,
        _depositController: depositController,
        _drawerController: drawerController,
        _navController: navController,
        _loginController: loginController,
        _calendarController: calendarController,
        _deviceController: deviceController,

        mySocket: io.connect('http://192.168.33.10:3000'),
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
            _paymentController:{
                rootElement: '#payment'
            },
            _depositController:{
                rootElement: '#deposit'
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
            _deviceController:{
                rootElement: '#device'
            }

        },
        __ready: function(){
            var self = this;
            this.hideWithout(this._logsController);
            console.log('ready');

            this.mySocket.on('syncRequestResponse', function(isSuccess){
                if(isSuccess){
                    self._deviceController.startSync();
                }else{
                    self._deviceController.syncFailued();
                }
            });

            this.mySocket.on('deviceFound', function(json){
                self._deviceController.detectDevice(json);
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
            this._navController.changeTitle('Logs');
            // ログ画面以外のDOM要素を隠す処理
        },
        '{rootElement} moveToStatus': function(){
            $.sidr('close', 'sidr');
            this._userController.load(tempLoginUserID);
            this.hideWithout(this._userController);
            this._navController.changeTitle('Status');
        },
        '{rootElement} moveToPayment': function(){
            this.hideWithout(this._paymentController);
            $.sidr('close', 'sidr');
            this._navController.changeTitle('Payment');
        },
        '{rootElement} moveToDeposit': function(){
            this.hideWithout(this._depositController);
            $.sidr('close', 'sidr');
            this._navController.changeTitle('Deposit');
        },
        '{rootElement} moveToLogin': function(){
            this.hideWithout(this._loginController);
            this._navController.changeTitle('Login');
        },
        '{rootElement} moveToCalendar': function(){
            this.hideWithout(this._calendarController);
            $.sidr('close', 'sidr');
            this._navController.changeTitle('Calendar');
        },
        '{rootElement} moveToDevice': function(){
            this._deviceController.load(tempLoginUserID);
            this.hideWithout(this._deviceController);
            $.sidr('close', 'sidr');
            this._navController.changeTitle('Device');
        },

        hideWithout: function(controller){// 引数に指定した要素以外の各ページに対応するDOM要素を全部隠す
            this._logsController.hide();
            this._userController.hide();
            this._calendarController.hide();
            this._paymentController.hide();
            this._depositController.hide();
            this._loginController.hide();
            this._deviceController.hide();
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

