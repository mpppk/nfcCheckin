$(function() {
    var navLogic = {
        __name: 'navLogic'
    };

    var navController = {
        __name: 'navController',
        __ready: function(){
            console.log("in navController ready");
            this.$find('#simple-menu').sidr();
        },
        navLogic: navLogic
    }
    h5.core.expose(navController);
});

