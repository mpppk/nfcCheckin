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
        }
    }
    h5.core.expose(navController);
});

