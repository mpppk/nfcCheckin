$(function() {
    var tempLoginID = 1;
    var calendarLogic = {
        __name: 'calendarLogic',
        getCheckinMember: function(startMoment){
            var dfd = this.deferred();
            var uri = '/checkinMember/' + startMoment.format('YYYY/MM/DD');
            $.getJSON(uri).done(function(data){
                dfd.resolve(data);
            }).fail(function(error) {
                dfd.reject(error.message);
            });
            return dfd.promise();
        },
        getBillOfMonth: function(year, month){
            var dfd = this.deferred();
            var uri = '/locaOfMonth/' + year + '/' + month + '/charge';
            $.getJSON(uri).done(function(data){
                dfd.resolve(data);
            }).fail(function(error) {
                dfd.reject(error.message);
            });
            return dfd.promise();
        },
        getLogs: function(){
            var dfd = this.deferred();
            $.getJSON("/logs").done(function(data){
                dfd.resolve(data);
            }).fail(function(error) {
                dfd.reject(error.message);
            });
            return dfd.promise();
        },
        getLogByUserID: function(userID){
            var dfd = this.deferred();
            var uri = '/logs/' + userID;
            $.getJSON(uri).done(function(data){
                dfd.resolve(data);
            }).fail(function(error) {
                dfd.reject(error.message);
            });
            return dfd.promise();
        },
        getCheckinLogEv: function(userID){
            var dfd = this.deferred();
            // 自分がチェックインしてない日のbillは表示しない処理をいつの日にか入れる
            this.getLogByUserID(userID).done(function(data){
                var len = data.length;
                var result = [];
                for (var i = 0; i < len; i++) {
                    result.push({
                        title: 'checkin',
                        start: data[i].checkin_time,
                        color: 'green'
                    });
                };
                dfd.resolve(result);
                // dfd.resolve( JSON.stringify(result) );
            }).fail(function(error) {
                dfd.reject(error.message);
            });
            return dfd.promise();
        },
        getBillOfMonthEv: function(year, month){
            var dfd = this.deferred();
            // 自分がチェックインしてない日のbillは表示しない処理をいつの日にか入れる
            this.getBillOfMonth(year, month).done(function(data){
                var len = data.length;
                var result = [];
                for (var i = 0; i < len; i++) {
                    var evColor = 'red';
                    if(data[i].user_id == tempLoginID){
                        evColor = 'blue';
                    }
                    result.push({
                        title: data[i].name,
                        start: data[i].datetime,
                        color: evColor
                    });
                };
                dfd.resolve(result);
                // dfd.resolve( JSON.stringify(result) );
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
            $(this.rootElement).find('#fullcalendar').fullCalendar({
                selectable: true,
                selectHelper: true,
                select: function(start, end) {
                    self.$find('#calendarInfo').show('fast');
                    self.calendarLogic.getCheckinMember(start).done(function(data){
                            self.$find('#calendarInfo').find($('h1')).text('Checkin Members ' + start.format('YYYY-MM-DD'));
                            var table = self.$find('#checkinMemberTable');
                            table.empty();
                            var len = data.length;
                            for(var i = 0; i < len; i++) {
                                var userName = data[i].user_name;
                                if(data[i].user_name == null)   userName = 'unknown';
                                table.append($('<tr>'));
                                var tr = table.find($('tr'));
                                tr = tr.eq(i);
                                tr.append($('<td>').text(userName));
                                tr.append($('<td>').text('test'));
                            }
                    });
                    g_start = start;
                    g_end = end;
                }
            });
            this.arrangeCheckinEvent();
            this.setCheckinBackground();
        },
        arrangeCheckinEvent: function(){
            var self = this;
            var calendar = $(this.rootElement).find('#fullcalendar');
            // ユーザのチェックイン情報を配置する
            // this.calendarLogic.getCheckinLogEv(tempLoginUserID).done(function(data){
            //     for(var i = 0; i < data.length; i++){
            //         calendar.fullCalendar('renderEvent', data[i]);
            //     }
            // });

            // billを配置する
            this.calendarLogic.getBillOfMonthEv(2014, 6).done(function(data){
                for(var i = 0; i < data.length; i++){
                    calendar.fullCalendar('renderEvent', data[i]);
                }
            });
        },
        setCheckinBackground: function(){
            var self = this;
            var calendar = $(this.rootElement).find('#fullcalendar');
            var userLoginColor = 'rgb(224, 255, 255)';// 224, 255, 255
            var otherUserLoginColor = 'rgb(255, 240, 245)';// 255, 240, 245
            this.calendarLogic.getLogs().done(function(data){
                for(var i = 0; i < data.length; i++){
                    var selector = 'td[data-date =\'' + data[i].checkin_time + '\']';
                    console.log($(selector).css('background-color'));
                    console.log()
                    if(data[i].user_id == tempLoginUserID){
                        $(selector).css("background", userLoginColor);
                    }else if($(selector).css('background-color') != userLoginColor){// ログインユーザがチェックインしていなければ他ユーザがチェックインした場合の色に変更
                        $(selector).css("background", otherUserLoginColor);
                    }
                }
            });

            // ユーザのチェックイン情報を配置する
            // this.calendarLogic.getLogByUserID(tempLoginUserID).done(function(data){
            //     for(var i = 0; i < data.length; i++){
            //         $('td[data-date =\'' + data[i].checkin_time + '\']').css("background", "#E0FFFF");
            //     }
            // });
        },
        '#addChargeBtn click': function() {
            this.$find('#auto_modal').modal('show');
            // $('#auto_modal').modal('show');
        },
        '{rootElement} addBill': function(context){
            var table = this.$find('#checkinMemberTable');
            table.prepend($('<tr>'));
            var tr = table.find($('tr'));
            tr = tr.eq(0);
            tr.append($('<td>').text(context.evArg.billName));
            tr.append($('<td>').text('test'));
        },

        hide: function(){
            this.$find('#calendarInfo').find($('h1')).text('');
            this.$find('#calendarInfo').hide('fast');
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

