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
            this.trigger('moveToLogs')
        },

        '#drawerStatus click': function() {
            this.trigger('moveToStatus')
        },

        '#drawerCalendar click': function() {
            this.trigger('moveToCalendar')
        },

        '#drawerLOCA click': function() {
            this.trigger('moveToLOCA')
        },

        '#drawerPayment click': function() {
            this.trigger('moveToPayment')
        },

        '#drawerDeposit click': function() {
            this.trigger('moveToDeposit')
        },

        '#drawerDevice click': function() {
            this.trigger('moveToDevice')
        }

    }
    h5.core.expose(drawerController);
});

