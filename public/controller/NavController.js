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
        }

    }
    h5.core.expose(navController);
});

