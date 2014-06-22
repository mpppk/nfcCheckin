$(function() {
    var cmodalLogic = {
        __name: 'cmodalLogic'
    };

    var cmodalController = {
        __name: 'cmodalController',

        cmodalLogic: cmodalLogic,

        '#chargebtn click': function() {
            var chargePrice = $('#chargeInput').val();
            console.log("price: " + chargePrice);
            var eventData;
            if (chargePrice) {
                eventData = {
                    title: chargePrice + 'LOCA',
                    start: g_start,
                    end: g_end
                };
                $('#fullcalendar').fullCalendar('renderEvent', eventData, true); // stick? = true
            }
            $('#fullcalendar').fullCalendar('unselect');
            $('#chargeInput').val("");
            $('#auto_modal').modal('hide');
        },

        hide: function(){
            $(this.rootElement).hide('slow');
        },
        show: function(){
            $(this.rootElement).show('slow');
        }
    }

    $('#auto_modal').on('shown.bs.modal', function () {
        $('#chargeInput').focus();
    });


    h5.core.expose(cmodalController);
});

