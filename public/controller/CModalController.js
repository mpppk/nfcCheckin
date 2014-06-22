$(function() {
    var cmodalLogic = {
        __name: 'cmodalLogic'
    };

    var cmodalController = {
        __name: 'cmodalController',

        cmodalLogic: cmodalLogic,

        '#chargebtn click': function() {
            var self = this;
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

            // message表示
            this.$find('#calendarInfo').prepend($('<div>').hide().attr({class:'alert alert-success text-centor'})
                .text('you succeeded adding bill.'));
            self.$find('.alert').show('fast');
            setTimeout(function(){
                self.$find('.alert').hide('slow');
                // self.$find('.alert').remove();
            }, 5000);
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

