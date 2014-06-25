var tempLoginUserID = 1;

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

        __meta:{
            _dmodalController: {
                rootElement:'#deviceModal'
            }
        },

        deviceLogic: deviceLogic,
        _dmodalController: dmodalController,
        progressPer: 0,
        intervalID: 0,
        __ready: function(){
            $(this.rootElement).prepend($("<h1>").text('your devices'));
            this.$find('.progress').hide('slow');
            // this.load();
        },
        load: function(userID){
            var self = this;
            this.deviceLogic.getDevice(userID).done(function(data){
                var len = data.length;
                console.log(data.length);
                var table =  self.$find('#deviceTable');
                table.empty();
                // var table =  $(this.rootElement).find($('deviceTable'));
                for(var i = 0; i < len; i++) {
                    var cardName = data[i].card_name;
                    if(data[i].card_name == null)   cardName = 'unknown card';
                    table.append($("<tr>"));
                    var tr = table.find($('tr'));
                    tr = tr.eq(i);
                    tr.append($("<td>").text(cardName));
                    tr.append($("<td>").text(data[i].idm_no));
                    tr.append($("<td>").text('test'));
                }
            });
        },
        syncFailue: function(){
            console.log('sync failued');
        },
        '#addDeviceBtn click': function() {
            // syncを実行中の場合は中断処理
            if(this.progressPer > 0){
                this.stopSync();
                return;
            }
            this.parentController.mySocket.emit('applySyncRequest');
        },

        // 10秒経つかデバイスを見つけるまでプログレスバーを表示して待ち受ける
        startSync: function(){
            var self = this;
            clearInterval(self.intervalID);// ボタンを連続で押した場合に備える
            this.progressPer = 100;
            this.$find('.progress').show('slow');
            this.$find('#progressMsg').empty();
            this.$find('#progressMsg').append($('<div>').attr({class:'alert text-centor'})
                .text('touch device to PaSoRi'));
            this.$find('#addDeviceBtn').attr({value:'cancel', class:'btn'});
            this.intervalID = setInterval(function(){stepProgress();}, 100);
            var stepProgress = function(){
                var progressBar = self.$find('.progress-bar');
                progressBar.css('width', self.progressPer + '%');
                var time = (self.progressPer/10).toFixed(1);
                progressBar.text(time + 'sec');
                self.progressPer -= 1;
                if(self.progressPer <= 0){
                    clearInterval(self.intervalID);
                    self.stopSync();
                    // self.$find('.progress').hide('slow');
                    self.$find('#progressMsg').append($('<div>').attr({class:'alert alert-danger text-centor'})
                        .text('failed to find the card. please try again.')).hide().show('slow');
                    // self.$find('#addDeviceBtn').attr({value:'add new card', class:'btn btn-primary'});
                }
            }
        },

        // syncを中断
        stopSync: function(){
            this.parentController.mySocket.emit('stopSync');
            this.progressPer = 0;
            clearInterval(this.intervalID);
            this.$find('.progress').hide('slow');
            this.$find('#progressMsg').empty();
            this.$find('#addDeviceBtn').attr({value:'add new card', class:'btn btn-primary'});
        },

        // 他のユーザが同期を始めていた場合の処理
        syncFailued: function(){
            // this.$find('#progressMsg').empty().append($('<div>').attr({class:'alert alert-warning text-centor'})
            //     .text('other user syncing. please try again later.');
            this.$find('#progressMsg').empty().append($('<div>').attr({class:'alert alert-warning text-centor'})
                .text('other user is syncing now. please try again later.'));
        },

        detectDevice: function(json){
            console.log('json: ' + json);
            this._dmodalController.json= json;
            this.$find('#deviceModal').modal('show');
            this.stopSync();
            // var json = JSON.parse(json);
            // var userName = 'unknown';
            // if(json.userName){
            //     userName = json.userName;
            // }
            // var ulObj = $('#logsTable');
            // ulObj.prepend($("<tr>").hide());
            // var tr = ulObj.find( $( 'tbody tr:eq(0)' ) );
            // tr.append($("<td>").text(userName));
            // tr.append($("<td>").text(json.checkinTime));
            // tr.append($("<td>").text('test'));
            // tr.show('slow');
        },
        addDevice: function(json){

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

