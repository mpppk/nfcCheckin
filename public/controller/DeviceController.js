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
            // this.load();
        },
        load: function(deviceID){
            console.log('in deviceController load');
            $(this.rootElement).empty();
            $(this.rootElement).append($("<h1>").text('your devices'));
            this.deviceLogic.getDevice(deviceID).done(function(data){
                var len = data.length;
                console.log('len: ' + len);
                for(var i = 0; i < len; i++) {
                    var cardName = data[i].card_name;
                    if(data[i].card_name == null)   cardName = 'unknown card';
                    console.log('card name is ' + cardName);
                    $(this.rootElement).append($("<tr>").attr({"data-index":i}));
                    var tr = $(this.rootElement).find( $( '<tbody> <tr>' ) );
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

