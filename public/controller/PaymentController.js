$(function() {
    var paymentLogic = {
        __name: 'paymentLogic'
    };

    var paymentController = {
        __name: 'paymentController',
        __ready: function(){
            this.load();
        },

        paymentLogic: paymentLogic,

        load: function(){
            $(this.rootElement).append($("<h1>").text('payment'));
        },
        hide: function(){
            $(this.rootElement).hide('slow');
        },
        show: function(){
            $(this.rootElement).show('slow');
        }
    }
    h5.core.expose(paymentController);
});

