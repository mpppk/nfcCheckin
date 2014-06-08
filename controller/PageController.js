$(function() {
	var a = 5;
    var pageController = {
        __name: 'PageController',
        _helloWorldController: helloWorldController,
        _logsController: logsController,
        loadLogSocket: io.connect('http://192.168.33.10:8888/loadLog'),
        helloSocket: io.connect('http://192.168.33.10:8888/hello'),
        __meta:{
            _helloWorldController:{
                rootElement: '#container'
            },
            _logsController:{
        		rootElement: '#container'
        	}
        },
        '{rootElement} pushHello': function() {
    		this.helloSocket.emit('emit_from_client', 'hello!');
	    	alert('test');
		}
    };

    pageController.helloSocket.on('emit_from_server', function(data){
        console.log(data);
    });

    pageController.loadLogSocket.on('emit_from_server', function(){
    	console.log('called by loadLog');
        pageController._logsController.load();
    });

    h5.core.controller('body', pageController );
});
