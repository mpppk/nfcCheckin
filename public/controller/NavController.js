$(function() {
    var navLogic = {
        __name: 'navLogic'
    };

    var navController = {
        __name: 'navController',
        __ready: function(){
            this.$find('#simple-menu').sidr();
        },
        navLogic: navLogic,
 
        '#loginbtn click': function() {
            this.trigger('moveToLogin');
        },
        changeTitle: function(title){
            this.$find('#pageTitle').text(title);
        },
        changeLoginTitle: function(user){
            if(user.isLogin){
                console.log('hide loginUl');
                this.$find('#loginUl').hide();
                this.$find('#loginMessage').text(user.userName + ' でログイン中');
                console.log(this.parentController.serverIP);
                var logoutURL = this.parentController.serverIP + '/logout';
                this.$find('#logoutbtn').attr({href: logoutURL});
                // this.$find('.navbar-right #logoutList').remove();
                // this.$find('.navbar-right').append($('<li id="logoutList">'));
                // var li = this.$find('.navbar-right #logoutList');
                // li.append($('<a>').text('ログアウト'));
            }else{
                console.log('hide logoutUl');
                this.$find('#logoutUl').hide();

                // this.$find('#loginbtn').text('ログイン');
                
            }
        }

    }
    h5.core.expose(navController);
});

