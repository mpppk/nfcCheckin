$(function() {
    var cmodalLogic = {
        __name: 'cmodalLogic'
    };

    var cmodalController = {
        __name: 'cmodalController',

        cmodalLogic: cmodalLogic,

        '#chargebtn click': function() {
            var self = this;
            var tempBillName = this.$find('#chargeNameInput').val();
            var chargePrice = this.$find('#chargeInput').val();
            console.log("price: " + chargePrice);
            var eventData;
            if (chargePrice) {
                eventData = {
                    title: tempBillName,
                    start: g_start,
                    end: g_end
                };
                $('#fullcalendar').fullCalendar('renderEvent', eventData, true); // stick? = true
            }

            // 親Controllerにテーブルを追加するためのイベント通知
            this.trigger('addBill', {
                billName: tempBillName,
                price: chargePrice
            });

            this.parentController.$find('#fullcalendar').fullCalendar('unselect');
            // this.$find('#fullcalendar').fullCalendar('unselect');
            this.$find('#chargeNameInput').val("");
            this.$find('#chargeInput').val("");
            this.$find('#auto_modal').modal('hide');
            // message表示
            self.$find('.alert').remove();
            this.$find('#calendarInfo').prepend($('<div>').hide().attr({class:'alert alert-success text-centor'})
                .text('追加しました'));
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
        $('#chargeNameInput').focus();
    });
    h5.core.expose(cmodalController);
});

