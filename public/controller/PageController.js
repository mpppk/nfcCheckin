$(function() {
    var pageController = {
        __name: 'PageController',
        _helloWorldController: helloWorldController,
        _logsController: logsController,
        _userController: userController,
        _drawerController: drawerController,
        _navController: navController,
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
            _drawerController:{
                rootElement: '#sidr'
            },
            _navController:{
                rootElement: '#navbar'
            }
        },
        '{rootElement} pushHello': function() {
    		this.helloSocket.emit('emit_from_client', 'hello!');
	       	alert('test');
		},
        load: function(){
            console.log('in pageController load');
            this._logsController.load();
        },
        '{rootElement} moveToLogs': function(){
            this.hideWithout(this._logsController);
            $.sidr('close', 'sidr');
            console.log('callled moveToLogs in PageController');
            // ログ画面以外のDOM要素を隠す処理
        },
        '{rootElement} moveToYou': function(){
            var tempUserID = 31;// 実際はログインしているユーザのIDを利用する
            console.log('callled moveToYou in PageController');
            $.sidr('close', 'sidr');
            this._userController.load(tempUserID);
            this.hideWithout(this._userController);
            // ユーザ画面以外のDOM要素を隠す処理
        },
        hideWithout: function(controller){// 引数に指定した要素以外の各ページに対応するDOM要素を全部隠す
            this._logsController.hide();
            this._userController.hide();
            
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

