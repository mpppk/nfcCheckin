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
                    var evColor = '#FFB6C1';
                    // var evColor = 'red';
                    if(data[i].user_id == tempLoginID){
                        evColor = '#87CEEB';
                        // evColor = 'blue';
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
        },
        // 各日付ごとのBillを格納した連想配列を返す
        getBillOfEachDay: function(year, month){

        }
    };

    var calendarController = {
        __name: 'calendarController',
        _cmodalController: cmodalController,
        calendarLogic: calendarLogic,
        __templates: 'h5views/checkinMember.ejs',
        __ready: function(){
            var self = this;
            // fullcalendar
            $(this.rootElement).find('#fullcalendar').fullCalendar({
                selectable: true,
                selectHelper: true,
                select: function(start, end) {
                    self.$find('#calendarInfo').find($('h1')).text(start.format('YYYY-MM-DD') + 'にチェックインしていたユーザー');
                    self.$find('#calendarInfo').show('fast');
                    self.calendarLogic.getBillOfMonth(2014, 6).done(function(charges){
                        self.calendarLogic.getCheckinMember(start).done(function(data){
                            console.log(data);
                            self.$find('#checkinMemberPanel').empty().hide();
                            for(var i = 0; i < data.length; i++) {
                                var panelType = 'panel-danger';
                                if(data[i].user_id == tempLoginUserID){
                                    panelType = 'panel-info';
                                }
                                self.view.append('#checkinMemberPanel', 'checkinMemberPanel', {name: data[i].user_name, id: data[i].user_id, panelType: panelType});

                            }
                            console.log(charges);
                            // この月のchargesを順番に見て、選択した日付ならばテーブルに追加
                            for(var i = 0; i < charges.length; i++) {
                                if(charges[i].datetime == start.format('YYYY-MM-DD')){
                                    var table = self.$find('#calendarInfo div .panel[data-userID=' + charges[i].user_id + '] table');
                                    // var table = self.$find('#checkinMemberPanel div[data-userID=' + charges[i].user_id + '] .chargeTable');
                                    table.prepend($('<tr>'));
                                    var tr = table.find('tr:eq(0)');
                                    tr.append($('<td>').text(charges[i].name));
                                    tr.append($('<td>').text('￥' + charges[i].price));
                                }
                            }
                            self.$find('#checkinMemberPanel').show('fast');
                        });
                    });
                    g_start = start;
                    g_end = end;
                }
            });
            this.arrangeCheckinEvent();
            this.setCheckinBackground();
            // this.showMemberPanel();
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
                    calendar.fullCalendar('renderEvent', data[i], true);
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
            var table = this.$find('#calendarInfo div .panel[data-userID=' + tempLoginUserID + '] table');
            table.prepend($('<tr class=\"success\">'));
            var tr = table.find('tr:eq(0)');
            tr.hide().append($('<td>').text(context.evArg.billName));
            tr.append($('<td>').text('￥' + context.evArg.price));
            tr.show('fast');
            setTimeout(function(){
                tr.attr({class: ''});
            }, 5000);
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

