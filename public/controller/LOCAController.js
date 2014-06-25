var tempLoginUserID = 1;
$(function() {
    var LOCALogic = {
        __name: 'LOCALogic',
        getLOCALog: function(userID){
            var dfd = this.deferred();
            $.getJSON("/LOCALog/" + userID).done(function(data){
                dfd.resolve(data);
            }).fail(function(error) {
                dfd.reject(error.message);
            });
            return dfd.promise();
        }
    };

    var LOCAController = {
        __name: 'LOCAController',
        __ready: function(){
            this.load();
        },

        LOCALogic: LOCALogic,

        load: function(){
            var self = this;
            $(this.rootElement).prepend($("<h1>").text('LOCA Logs'));
            this.LOCALogic.getLOCALog(tempLoginUserID).done(function(data){
                var len = data.length;
                var table =  self.$find('#locaTable');
                table.empty();
                // var table =  $(this.rootElement).find($('deviceTable'));
                for(var i = 0; i < len; i++) {
                    var name = data[i].name;
                    if(data[i].name == null)   name = 'no name';
                    var className = '';
                    switch (data[i].type){
                      case 'payment':
                        className = 'danger';
                        break;
                      case 'deposit':
                        className = 'success';
                        break;
                      case 'charge':
                        className = 'warning';
                        break;
                    }
                    table.append($("<tr class=" + className + ">"));
                    var tr = table.find($('tr'));
                    tr = tr.eq(i);
                    tr.append($("<td>").text(name));
                    tr.append($("<td>").text(data[i].datetime));
                    tr.append($("<td>").text('￥' + data[i].price));
                    tr.append($("<td>").text(data[i].type));
                }

            });
        },
        '#locaAllBtn click': function(){
            this.$find('.danger').show('fast');
            this.$find('.success').show('fast');
            this.$find('.warning').show('fast');
        },
        '#locaPaymentBtn click': function(){
            this.$find('.danger').show('slow');
            this.$find('.success').hide('fast');
            this.$find('.warning').hide('fast');
        },
        '#locaDepositBtn click': function(){
            this.$find('.danger').hide('fast');
            this.$find('.success').show('slow');
            this.$find('.warning').hide('fast');
        },
        '#locaChargeBtn click': function(){
            this.$find('.danger').hide('fast');
            this.$find('.success').hide('fast');
            this.$find('.warning').show('slow');
        },
        hide: function(){
            $(this.rootElement).hide('slow');
        },
        show: function(){
            $(this.rootElement).show('slow');
        }
    }
    h5.core.expose(LOCAController);
});

