$(function() {
    var drawerLogic = {
        __name: 'drawerLogic',
    };

    var drawerController = {
        __name: 'drawerController',

        drawerLogic: drawerLogic,
        __ready: function(){
            $(window).touchwipe({
              wipeLeft: function() {
                // Close
                $.sidr('close', 'sidr');
              },
              wipeRight: function() {
                // Open
                $.sidr('open', 'sidr');
              },
              preventDefaultEvents: false
            });
        },

        user: function(){
            var self = this;
        },

        '#drawerLogs click': function() {
            console.log('log pushed');
            this.trigger('moveToLogs')
        },

        '#drawerYou click': function() {
            console.log('user pushed');
            this.trigger('moveToYou')
        },

        '#drawerPayment click': function() {
            console.log('sync pushed');
            this.trigger('moveToPayment')
        },

        '#drawerDeposit click': function() {
            console.log('sync pushed');
            this.trigger('moveToDeposit')
        }

    }
    h5.core.expose(drawerController);
});

