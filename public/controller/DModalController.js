$(function() {
    var dmodalLogic = {
        __name: 'dmodalLogic'
    };

    var dmodalController = {
        __name: 'dmodalController',

        dmodalLogic: dmodalLogic,

        json: 0,

        __ready: function(){
            var self = this;
            $(self.rootElement).on('shown.bs.modal', function () {
                console.log('in shown');
                self.$find('#deviceName').focus();
            });
        },
        '#deviceNameSubmitBtn click': function() {
            this.trigger('addDeviceToTable');
            $(this.rootElement).modal('hide');
        },

        hide: function(){
            $(this.rootElement).hide('slow');
        },
        show: function(){
            $(this.rootElement).show('slow');
        }
    }
    h5.core.expose(dmodalController);
});

