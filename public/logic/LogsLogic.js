// var logsLogic = {
//     __name: 'logsLogic',

//     getlogs: function(){
//         var dfd = this.deferred();  
//         console.log("in logsLogic getlogs");
//         this._getLogsJson().done(function(data) {
//             var ulObj = self.$find('#logsList');
//             var len = data.length;
//             for(var i = 0; i < len; i++) {
//                 var userName = data[i].user_name;
//                 if(data[i].user_name == null)   userName = 'unknown';
//                 ulObj.empty().append($("<li>").attr({"id":data[i].id}).text(userName + ' ' + data[i].checkin_time));
//             }
//         }).fail(function(error) {
//             dfd.reject(error.message);
//         });

//         return dfd.promise();
//     },

//     _getLogsJson: function(){
//         var promise = $.getJSON("/logs");
//         return promise;    
//     }

// };

