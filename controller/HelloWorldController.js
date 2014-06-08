$(function() {
    var helloWorldController = {
        __name: 'helloWorldController',
 
        '#btn click': function() {
            this.trigger('pushHello');
        	// var socket = io.connect();
        	// socket.emit('emit_from_client', 'hello!');
            // alert('Hello, World! in step3.js');
        }
    };
    h5.core.expose(helloWorldController);
    // h5.core.controller('#container', helloWorldController );
});
