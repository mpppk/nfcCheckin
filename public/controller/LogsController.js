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
        }
    };

    var logsController = {
        __name: 'logsController',
        // __templates: 'h5views/logs.ejs',
        __ready: function(){
            $(this.rootElement).prepend($('<h1>').text('recent logs'));
            this.load();
        },

        logsLogic: logsLogic,

        load: function(){
            var self = this;
            this.logsLogic.getLogs().done(function(data){
                var ulObj = self.$find('#logsTable');
                // for(var prop in self){
                //     console.log(prop);
                // }

                ulObj.empty();
                var len = data.length;
                // for(var i = 0; i < 2; i++) {
                for(var i = 0; i < len; i++) {
                    var userName = data[i].user_name;
                    if(data[i].user_name == null)   userName = 'unknown';
                    ulObj.append($("<tr>"));
                    // ulObj.append($("<tr>").attr({"data-index":i}));
                    // var tr = ulObj.find( $( '<tbody> <tr>' ) );
                    var tr = ulObj.find( $( 'tbody tr:eq(' + i + ')' ) );
                    // var tr = ulObj.find( $( 'tbody tr' ) );
                    tr.append($("<td>").text(userName));
                    tr.append($("<td>").text(data[i].checkin_time));
                    tr.append($("<td>").text('test'));
                }
            });
        },
        addLog: function(json){
            // 直接触りたくないけどどうしても動かないので泣きながら直接触る
            // var ulObj = self.$find('#logsTable');
            var json = JSON.parse(json);
            var userName = 'unknown';
            if(json.userName){
                userName = json.userName;
            }
            var ulObj = $('#logsTable');
            ulObj.prepend($("<tr>").hide());
            var tr = ulObj.find( $( 'tbody tr:eq(0)' ) );
            tr.append($("<td>").text(userName));
            tr.append($("<td>").text(json.checkinTime));
            tr.append($("<td>").text('test'));
            tr.show('slow');
            console.log(json);
        },
        hide: function(){
            $(this.rootElement).hide('slow');
        },
        show: function(){
            console.log('log show');
            $(this.rootElement).show('slow');
        }
    }
    h5.core.expose(logsController);
});

