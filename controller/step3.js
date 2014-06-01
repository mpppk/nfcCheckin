$(function() {
    var helloWorldController = {
        __name: 'HelloWorldController',
 
        '#btn click': function() {
            alert('Hello, World!');
        }
    };

    h5.core.controller('#container', helloWorldController );
});
