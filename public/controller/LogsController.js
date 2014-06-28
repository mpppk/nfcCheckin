$(function() {
    var logsLogic = {
        __name: 'logsLogic',
        getLogs: function(){
            var dfd = this.deferred();
            $.getJSON("/logs").done(function(data){
                dfd.resolve(data);
            }).fail(function(error) {
                dfd.reject(error.message);
            });
            return dfd.promise();
        },
        getUser: function(userID){
            var dfd = this.deferred();
            $.getJSON("/user/" + userID).done(function(data){
                dfd.resolve(data);
            }).fail(function(error) {
                dfd.reject(error.message);
            });
            return dfd.promise();
        }
    };

    var logsController = {
        __name: 'logsController',
        // __templates: 'h5views/logs.ejs',
        __ready: function(){
            $(this.rootElement).prepend($('<h1>').text('ログ履歴'));
            this.load();
        },

        logsLogic: logsLogic,

        load: function(){
            var self = this;
            this.logsLogic.getLogs().done(function(data){
                var ulObj = self.$find('#logsTable');
                ulObj.empty();
                var len = data.length;
                for(var i = 0; i < len; i++) {
                    var userName = data[i].user_name;
                    if(data[i].user_name == null)   userName = 'unknown';
                    var cardName = data[i].card_name;
                    if(data[i].card_name == null)   cardName = 'unknown';
                    ulObj.append($("<tr data-idm=\"" + data[i].idm_no + "\">"));
                    var tr = ulObj.find( $( 'tbody tr:eq(' + i + ')' ) );
                    tr.append($("<td class=\"userName\">").text(userName));
                    tr.append($("<td class=\"checkin\">").text(data[i].checkin_time));
                    tr.append($("<td class=\"cardName\">").text(cardName));
                }
            });
        },
        addLog: function(json){
            // 直接触りたくないけどどうしても動かないので泣きながら直接触る
            // var ulObj = self.$find('#logsTable');
            var json = JSON.parse(json);
            var userName = 'unknown';
            var cardName = 'unknown';
            if(json.userName){userName = json.userName; }
            if(json.cardName){cardName = json.cardName; }
            var ulObj = $('#logsTable');
            ulObj.prepend($("<tr class=\"success\" data-idm=\"" + json.IDm + "\">").hide());
            var tr = ulObj.find( $( 'tbody tr:eq(0)' ) );
            tr.append($("<td class=\"userName\">").text(userName));
            tr.append($("<td class=\"checkin\">").text(json.checkinTime));
            tr.append($("<td class=\"cardName\">").text(cardName));
            tr.show('slow');
            setTimeout(function(){
                tr.hide();
                tr.attr({class: ''});
                tr.show('fast');
            }, 5000);
        },
        // 他のユーザがデバイスをsyncした際にLogsを更新するための処理
        updateUser: function(json){
            var self = this;
            console.log('in updateUser');
            console.log(json);
            this.logsLogic.getUser(json.userID).done(function(userInfo){
                // 現在のテーブルから、受け取ったIDmを持つデバイスのユーザ名を変更
                // 全てのtd要素を取得
                var table = self.$find('#logsTable');
                var selector = 'tr[data-idm=\'' + json.IDm + '\']';
                var trs = table.find(selector);
                trs.hide();
                trs.attr({class: 'warning'}).end().find('td.userName').text(userInfo.userName);
                trs.find('td.cardName').text(json.deviceName);
                trs.show('fast');
                setTimeout(function(){
                    trs.hide();
                    trs.attr({class: ''});
                    trs.show('fast');
                }, 5000);

            });
        },
        hide: function(){
            $(this.rootElement).hide('slow');
        },
        show: function(){
            $(this.rootElement).show('slow');
        }
    }
    h5.core.expose(logsController);
});

