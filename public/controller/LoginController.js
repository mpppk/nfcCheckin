$(function() {
    var loginLogic = {
        __name: 'loginLogic'
    };

    var loginController = {
        __name: 'loginController',
        __ready: function(){
        },

        loginLogic: loginLogic,

        hide: function(){
            $(this.rootElement).hide('slow');
        },
        show: function(){
            $(this.rootElement).show('slow');
        }
    }
    h5.core.expose(loginController);
});

