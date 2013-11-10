'use strict';

sentinelfApp.factory('UsersGroupsService', function(){
	return {
		merge: function(users, groups){
			for(var i = 0; i < groups.length; i++)
				groups[i]['readonly'] = true;
			for(var i = 0; i < users.length; i++){
					var group_id = users[i].group_id; 
					for(var j = 0; j < groups.length; j++){
						if(group_id == groups[j].id){
							users[i]['group'] = groups[j];
							break;
						}
					}
				}			
			}, 
	}
});