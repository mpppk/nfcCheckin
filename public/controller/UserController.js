$(function() {
    var userLogic = {
        __name: 'userLogic',
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

    var userController = {
        __name: 'userController',
        userLogic: userLogic,
        _calendarController: calendarController,
        __meta:{
            _calendarController:{
                rootElement: '#calendar'
            }
        },
        __ready: function(){
            this.hide();
        },
        // __templates: 'h5views/user.ejs',
        load: function(userID){
            var self = this;
            console.log('in userController userID: ' + userID);
            this.userLogic.getUser(userID).done(function(data){
                var target = self.$find('#userName');
                var len = data.length;
                console.log(data.userName);
                self.$find('#userName').empty().append(data.userName);
                self.$find('#userProfile').empty().append(data.profile);
                self.$find('#userLOCA').empty().append(data.coin);
            });
        },
        hide: function(){
            $(this.rootElement).hide('slow');
            this._calendarController.hide();
        },
        show: function(){
            $(this.rootElement).show('slow');
        },

        '#calendarbtn click': function() {
            console.log('calendar btn clicked');
            this._calendarController.toggle();
        }
    }
    h5.core.expose(userController);
});

