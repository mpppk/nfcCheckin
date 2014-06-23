$(function() {
    var dmodalLogic = {
        __name: 'dmodalLogic'
    };

    var dmodalController = {
        __name: 'dmodalController',

        dmodalLogic: dmodalLogic,

        json: null,

        '#deviceNameSubmitBtn click': function() {
            var deviceName = this.$find('#deviceName').val();
            console.log('deviceName' + deviceName);
            var table = this.parentController.$find('#deviceTable');
            table.find('tbody').prepend('<tr></tr>');// こいつが戦犯
            var tr = table.find('tbody tr:first');
            tr.append("<td>" + deviceName + "</td>");
            tr.append('<td>000000</td>');
            tr.append('<td>test</td>');
            this.$find('#deviceName').val('');
            $(this.rootElement).modal('hide');
            // $(this.rootElement).modal('hide');
        },

        hide: function(){
            $(this.rootElement).hide('slow');
        },
        show: function(){
            $(this.rootElement).show('slow');
        }
    }

    $(this.rootElement).on('shown.bs.modal', function () {
        console.log('dmodal shown');
        // $('#deviceName').focus();
        this.$find('#deviceName').focus();
    });
    h5.core.expose(dmodalController);
});

