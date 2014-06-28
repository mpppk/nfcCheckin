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
        json: null,
        __ready: function(){
            $(this.rootElement).prepend($("<h1>").text('登録カード一覧'));
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
                    if(data[i].card_name == null)   cardName = '名称未登録';
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
            console.log('カードの登録に失敗しました');
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
                .text('登録するカードをかざしてください'));
            this.$find('#addDeviceBtn').attr({value:'中止', class:'btn'});
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
                        .text('カードを見つけられませんでした。もう一度やり直してください')).hide().show('slow');
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
            this.$find('#addDeviceBtn').attr({value:'新しいカードを追加', class:'btn btn-primary'});
        },

        // 他のユーザが同期を始めていた場合の処理
        syncFailued: function(){
            // this.$find('#progressMsg').empty().append($('<div>').attr({class:'alert alert-warning text-centor'})
            //     .text('other user syncing. please try again later.');
            this.$find('#progressMsg').empty().append($('<div>').attr({class:'alert alert-warning text-centor'})
                .text('他のユーザーが同期中です。時間をおいてもう一度試してください。'));
        },

        detectDevice: function(json){
            // jsonの中身
            // cardName, checkinNum, userName, IDm, checkinTime

            this.json= JSON.parse(json);
            this.$find('#deviceModal').modal('show');
            this.stopSync();
        },
        '{rootElement} addDeviceToTable': function(){
            // this.jsonの中身
            // cardName, checkinNum, userName, IDm, checkinTime
            var deviceName = this.$find('#deviceName').val();
            var table = this.parentController.$find('#deviceTable');
            table.find('tbody').prepend('<tr></tr>');
            var tr = table.find('tbody tr:first');
            tr.append("<td>" + deviceName + "</td>");
            tr.append('<td>000000</td>');
            tr.append('<td>test</td>');
            this.json.userID = tempLoginUserID;
            this.json.deviceName = deviceName;

            this.parentController.mySocket.emit('deviceAdded', this.json);
            this.$find('#deviceName').val('');// reset
        },
        hide: function(){
            clearInterval(self.intervalID);// ボタンを連続で押した場合に備える
            this.progressPer = 0;
            this.$find('#progressMsg').empty();
            $(this.rootElement).hide('slow');
        },
        show: function(){
            $(this.rootElement).show('slow');
        },
        toggle: function(){
            $(this.rootElement).toggle('slow');
        }
    }
    h5.core.expose(deviceController);
});

