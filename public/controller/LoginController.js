$(function() {
    var loginLogic = {
        __name: 'loginLogic'
    };

    var loginController = {
        __name: 'loginController',
        __ready: function(){
        },

        loginLogic: loginLogic,
        changeView: function(isLogin){
            if(isLogin){
                this.$find('#loginForm').remove();
            }else{
                this.$find('#logout').remove();
            }
            this.$find('#simple-menu').sidr();
            
        },
        hide: function(){
            $(this.rootElement).hide('slow');
        },
        show: function(){
            $(this.rootElement).show('slow');
        }
    }
    h5.core.expose(loginController);
});

