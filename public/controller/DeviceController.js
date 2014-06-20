$(function() {
    var deviceLogic = {
        __name: 'deviceLogic',
        getDevice: function(userID){
            var dfd = this.deferred();
            $.getJSON("/device/" + userID).done(function(data){
                dfd.resolve(data);
            }).fail(function(error) {
                dfd.reject(error.message);
            });
            return dfd.promise();
        }
    };

    var deviceController = {
        __name: 'deviceController',

        deviceLogic: deviceLogic,
        __ready: function(){
            $(this.rootElement).prepend($("<h1>").text('your devices'));
            // this.load();
        },
        load: function(userID){
            var self = this;
            console.log('in deviceController load');
            this.deviceLogic.getDevice(userID).done(function(data){
                var len = data.length;
                console.log(data.length);
                var table =  self.$find('#deviceTable');
                table.empty();
                // var table =  $(this.rootElement).find($('deviceTable'));
                for(var i = 0; i < len; i++) {
                    var cardName = data[i].card_name;
                    if(data[i].card_name == null)   cardName = 'unknown card';
                    console.log('card name is ' + cardName);
                    table.append($("<tr>"));
                    var tr = table.find($('tr'));
                    tr = tr.eq(i);
                    console.log('tr num: ' + tr.length);
                    tr.append($("<td>").text(cardName));
                    tr.append($("<td>").text(data[i].idm_no));
                    tr.append($("<td>").text('test'));
                }
            });
        },
        hide: function(){
            $(this.rootElement).hide('slow');
        },
        show: function(){
            console.log('device show');
            $(this.rootElement).show('slow');
        },
        toggle: function(){
            $(this.rootElement).toggle('slow');
        }
    }
    h5.core.expose(deviceController);
});

