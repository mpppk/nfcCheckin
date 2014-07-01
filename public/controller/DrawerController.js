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
            this.trigger('moveToLogs');
        },

        '#drawerStatus click': function() {
            if(!this.parentController.user.isLogin){this.trigger('moveToLogin'); }
            else{this.trigger('moveToStatus');}
        },

        '#drawerCalendar click': function() {
            if(!this.parentController.user.isLogin){this.trigger('moveToLogin'); }
            else{this.trigger('moveToCalendar');}
        },

        '#drawerLOCA click': function() {
            if(!this.parentController.user.isLogin){this.trigger('moveToLogin'); }
            else{this.trigger('moveToLOCA');}
        },

        '#drawerPayment click': function() {
            if(!this.parentController.user.isLogin){this.trigger('moveToLogin'); }
            else{this.trigger('moveToPayment');}
        },

        '#drawerDeposit click': function() {
            if(!this.parentController.user.isLogin){this.trigger('moveToLogin'); }
            else{this.trigger('moveToDeposit');}
        },

        '#drawerDevice click': function() {
            if(!this.parentController.user.isLogin){this.trigger('moveToLogin'); }
            else{this.trigger('moveToDevice');}
        }
    }
    h5.core.expose(drawerController);
});

