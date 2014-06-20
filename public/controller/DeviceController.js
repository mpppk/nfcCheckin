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
        progressPer: 100,
        intervalID: 0,
        __ready: function(){
            $(this.rootElement).prepend($("<h1>").text('your devices'));
            this.$find('.progress').hide('slow');
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
                    tr.append($("<td>").text(cardName));
                    tr.append($("<td>").text(data[i].idm_no));
                    tr.append($("<td>").text('test'));
                }
            });
        },
        '#addDeviceBtn click': function() {
            var self = this;
            clearInterval(self.intervalID);// ボタンを連続で押した場合に備える
            this.progressPer = 100;
            this.$find('.progress').show('slow');
            this.$find('#progressMsg').empty();
            this.$find('#progressMsg').append($('<div>').attr({class:'alert alert-info text-centor'})
                .text('touch device to PaSoRi'));
            this.intervalID = setInterval(function(){stepProgress();}, 100);
            var stepProgress = function(){
                // var self = this;
                var progressBar = self.$find('.progress-bar');
                progressBar.css('width', self.progressPer + '%');
                var time = (self.progressPer/10).toFixed(1);
                progressBar.text(time + 'sec');
                self.progressPer -= 1;
                if(self.progressPer <= 0){
                    clearInterval(self.intervalID);
                    self.$find('.progress').hide('slow');
                    self.$find('#progressMsg').empty();
                    self.$find('#progressMsg').append($('<div>').attr({class:'alert alert-danger text-centor'})
                        .text('failed to find the card. please try again.'));
                }
            }
        },
        hide: function(){
            clearInterval(self.intervalID);// ボタンを連続で押した場合に備える
            this.progressPer = 0;
            this.$find('#progressMsg').empty();
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

