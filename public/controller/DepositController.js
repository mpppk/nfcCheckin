$(function() {
    var depositLogic = {
        __name: 'depositLogic'
    };

    var depositController = {
        __name: 'depositController',
        __ready: function(){
            this.load();
        },

        depositLogic: depositLogic,

        load: function(){
            $(this.rootElement).append($("<h1>").text('deposit'));
        },

        hide: function(){
            $(this.rootElement).hide('slow');
        },
        show: function(){
            $(this.rootElement).show('slow');
        }
    }
    h5.core.expose(depositController);
});

