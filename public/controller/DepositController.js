$(function() {
    var depositLogic = {
        __name: 'depositLogic'
    };

    var depositController = {
        __name: 'depositController',
        __ready: function(){
        },

        depositLogic: depositLogic,

        hide: function(){
            $(this.rootElement).hide('slow');
        },
        show: function(){
            $(this.rootElement).show('slow');
        }
    }
    h5.core.expose(depositController);
});

