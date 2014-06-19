$(function() {
    var paymentLogic = {
        __name: 'paymentLogic'
    };

    var paymentController = {
        __name: 'paymentController',
        __ready: function(){
        },

        paymentLogic: paymentLogic,

        hide: function(){
            $(this.rootElement).hide('slow');
        },
        show: function(){
            $(this.rootElement).show('slow');
        }
    }
    h5.core.expose(paymentController);
});

