$(function() {
    var calendarLogic = {
        __name: 'calendarLogic',
        getCheckinMember: function(startMoment){
            var dfd = this.deferred();
            var uri = "/checkinMember/" + startMoment.format('YYYY/MM/DD');
            console.log('uri ' + uri);
            $.getJSON(uri).done(function(data){
                dfd.resolve(data);
            }).fail(function(error) {
                dfd.reject(error.message);
            });
            return dfd.promise();
        }
    };

    var calendarController = {
        __name: 'calendarController',
        _cmodalController: cmodalController,
        calendarLogic: calendarLogic,
        // __templates: 'h5views/logs.ejs',
        __ready: function(){
            var self = this;
            // fullcalendar
            $(this.rootElement).find("#fullcalendar").fullCalendar({
                selectable: true,
                selectHelper: true,
                select: function(start, end) {
                    self.calendarLogic.getCheckinMember(start).done(function(data){
                            self.$find("#calendarInfo").find($('h1')).text(start.format('YYYY-MM-DD'));
                            var table = self.$find("#checkinMemberTable");
                            table.empty();
                            var len = data.length;
                            for(var i = 0; i < len; i++) {
                                var userName = data[i].user_name;
                                if(data[i].user_name == null)   userName = 'unknown';
                                table.append($("<tr>"));
                                var tr = table.find($('tr'));
                                tr = tr.eq(i);
                                tr.append($("<td>").text(userName));
                                tr.append($("<td>").text('test'));
                            }
                    });
                    g_start = start;
                    g_end = end;
                    // bootstrap modal window
                    $('#auto_modal').modal('show');
                }
            });
            this.showInfo();
        },


        showInfo: function(){
            console.log('in showInfo');
            var self = this;
            // this.logslogic.getlogs().done(function(data){
            //     var infodiv = self.$find('#calendarinfo');
            //     infodiv.empty();
            //     var len = data.length;
            //     // for(var i = 0; i < 2; i++) {
            //     for(var i = 0; i < len; i++) {
            //         var username = data[i].user_name;
            //         if(data[i].user_name == null)   username = 'unknown';
            //         infodiv.append($("<tr>"));
            //         // infodiv.append($("<tr>").attr({"data-index":i}));
            //         // var tr = infodiv.find( $( '<tbody> <tr>' ) );
            //         var tr = infodiv.find( $( 'tbody tr:eq(' + i + ')' ) );
            //         // var tr = infodiv.find( $( 'tbody tr' ) );
            //         tr.append($("<td>").text(username));
            //         tr.append($("<td>").text(data[i].checkin_time));
            //         tr.append($("<td>").text('test'));
            //     }
            // }
        },
        hide: function(){
            this.$find("#calendarInfo").find($('h1')).text('');
            $(this.rootElement).hide('slow');
        },
        show: function(){
            console.log('calendar show');
            $(this.rootElement).show('slow');
        },
        toggle: function(){
            $(this.rootElement).toggle('slow');
        }
    }
    h5.core.expose(calendarController);
});
