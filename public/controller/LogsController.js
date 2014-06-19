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
        	this.load();
        },

        logsLogic: logsLogic,

        load: function(){
            var self = this;
            this.logsLogic.getLogs().done(function(data){
                var ulObj = self.$find('#logsList');
                var len = data.length;
                for(var i = 0; i < len; i++) {
                    var userName = data[i].user_name;
                    if(data[i].user_name == null)   userName = 'unknown';
                    ulObj.empty().append($("<li>").attr({"id":data[i].id}).text(userName + ' ' + data[i].checkin_time));
                }
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

