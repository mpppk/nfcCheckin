$(function() {
    var logsController = {
        __name: 'logsController',
 
        __construct: function(){
        	this.load();
        },

        load: function(){
            $.getJSON("../api/getLog.php" , function(data) {
        	    var ulObj = $("#logs");
        	    var len = data.length;
        	    for(var i = 0; i < len; i++) {
                    var userName = data[i].user_name;
                    if(data[i].user_name == null)   userName = 'unknown';
                    ulObj.append($("<li>").attr({"id":data[i].id}).text(userName + ' ' + data[i].checkin_time));
        	      // ulObj.append($("<li>").attr({"id":data[i].id}).text(data[i].user_name));
        		}
        	});
        }
    }
    h5.core.expose(logsController);
});

