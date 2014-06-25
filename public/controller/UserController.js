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
        __ready: function(){
            this.$find('.panel-body').hide();
            this.hide();
        },
        // __templates: 'h5views/user.ejs',
        load: function(userID){
            var self = this;
            this.userLogic.getUser(userID).done(function(data){
                console.log(data.userName);
                self.$find('#userName').prepend(data.userName);
                // self.$find('#userName').append($( data.userName + '<small>' + data.profile + '</small>'));
                self.$find('#userName small').text(' ' + data.profile);
                self.$find('#userLOCA').empty().append('LOCA: ' + data.coin);
                self.$find('#userCheckinNum').empty().append('checkin of this month: ' + 12);
                self.$find('#userCheckinTime').empty().append('checkin time');
            });
        },
        '#userLOCA click': function() {
            this.$find('#userLOCA').parent('div').next().toggle('fast');
            var data = {
                labels : ["June 1","June 11","June 21","June 21","July l","July 11","July 21"],
                datasets : [
                    {
                        fillColor : "rgba(151,187,205,0.5)",
                        strokeColor : "rgba(151,187,205,1)",
                        pointColor : "rgba(151,187,205,1)",
                        pointStrokeColor : "#fff",
                        data : [650,590,900,810,560,550,500]
                    }
                ]
            }
            var ctx = $("#LOCAChart").get(0).getContext("2d");
            new Chart(ctx).Line(data);
        },
        '#userCheckinNum click': function() {
            this.$find('#userCheckinNum').parent('div').next().toggle('fast');
            var data = {
                labels : ["June 1","June 11","June 21","June 21","July l","July 11","July 21"],
                datasets : [
                    {
                        fillColor : "rgba(151,187,205,0.5)",
                        strokeColor : "rgba(151,187,205,1)",
                        pointColor : "rgba(151,187,205,1)",
                        pointStrokeColor : "#fff",
                        data : [650,590,900,810,560,550,400]
                    }
                ]
            }
            var ctx2 = $("#CheckinChart").get(0).getContext("2d");
            new Chart(ctx2).Bar(data);

        },
        '#userCheckinTime click': function() {
            this.$find('#userCheckinTime').parent('div').next().toggle('fast');
            var ddata = [
                {
                    value: 30,
                    color:"#F7464A"
                },
                {
                    value : 50,
                    color : "#E2EAE9"
                },
                {
                    value : 100,
                    color : "#D4CCC5"
                },
                {
                    value : 40,
                    color : "#949FB1"
                },
                {
                    value : 120,
                    color : "#4D5360"
                }
            ]
            var ctx = $("#timeChart").get(0).getContext("2d");
            new Chart(ctx).Doughnut(ddata);
        },
        hide: function(){
            $(this.rootElement).hide('slow');
        },
        show: function(){
            $(this.rootElement).show('slow');
            // var myNewChart = new Chart(ctx);
        }
    }
    h5.core.expose(userController);
});

