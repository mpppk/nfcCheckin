$(function() {
    var calendarLogic = {
        __name: 'calendarLogic'
    };

    var calendarController = {
        __name: 'calendarController',
        _cmodalController: cmodalController,
        // __templates: 'h5views/logs.ejs',
        __ready: function(){
            // fullcalendar
            $(this.rootElement).fullCalendar({
                selectable: true,
                selectHelper: true,
                select: function(start, end) {
                    g_start = start;
                    g_end = end;
                    // bootstrap modal window
                    $('#auto_modal').modal('show');
                }
            });
        },

        calendarLogic: calendarLogic,

        hide: function(){
            $(this.rootElement).hide('slow');
        },
        show: function(){
            $(this.rootElement).show('slow');
        },
        toggle: function(){
            $(this.rootElement).toggle('slow');
        }
    }
    h5.core.expose(calendarController);
});

