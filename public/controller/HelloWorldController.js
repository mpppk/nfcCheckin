$(function() {
    var helloWorldController = {
        __name: 'helloWorldController',
 
        '#btn click': function() {
            this.trigger('pushHello');
        }
    };
    h5.core.expose(helloWorldController);
    // h5.core.controller('#container', helloWorldController );
});
