$(function() {
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
        loadLogSocket: io.connect('http://192.168.33.10:3000'),
        helloSocket: io.connect('http://192.168.33.10:3000'),
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
            }
        },

        load: function(){
            this._logsController.load();
        },
        '{rootElement} moveToLogs': function(){
            this.hideWithout(this._logsController);
            $.sidr('close', 'sidr');
            // ログ画面以外のDOM要素を隠す処理
        },
        '{rootElement} moveToYou': function(){
            var tempUserID = 31;// 実際はログインしているユーザのIDを利用する
            $.sidr('close', 'sidr');
            this._userController.load(tempUserID);
            this.hideWithout(this._userController);
            // ユーザ画面以外のDOM要素を隠す処理
        },
        '{rootElement} moveToPayment': function(){
            this.hideWithout(this._paymentController);
            $.sidr('close', 'sidr');
            // ログ画面以外のDOM要素を隠す処理
        },
        '{rootElement} moveToDeposit': function(){
            this.hideWithout(this._depositController);
            $.sidr('close', 'sidr');
            // ログ画面以外のDOM要素を隠す処理
        },
        '{rootElement} moveToLogin': function(){
            this.hideWithout(this._loginController);
            // ログ画面以外のDOM要素を隠す処理
        },

        hideWithout: function(controller){// 引数に指定した要素以外の各ページに対応するDOM要素を全部隠す
            this._logsController.hide();
            this._userController.hide();
            this._paymentController.hide();
            this._depositController.hide();
            this._loginController.hide();
            controller.show();
        }
    };

    pageController.helloSocket.on('emit_from_server', function(data){
        console.log(data);
    });

    pageController.loadLogSocket.on('emit_from_server', function(){
        pageController.load();
        // pageController._logsController.load();
    });

    h5.core.controller('body', pageController );
});

