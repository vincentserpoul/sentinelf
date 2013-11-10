'use strict';
/*
/* a service to reset the object to original values if users do not confirm changes
*/
sentinelfApp.factory('formService', function($resource) {
 	return {
 		copyProps : function(source, destination){
 			for(var prop in source){
 				destination[prop] = source[prop];
 			}
 		}, 
 		findObjectById : function(listObject, idObject){
            for(var i in listObject){
                if(listObject[i].id == idObject) {return listObject[i]};
            }
            return listObject[0];
        },
        findObjectByCode : function(listObject, codeObject){
            for(var i in listObject){
                if(listObject[i].code == codeObject) {return listObject[i]};
            }
            return listObject[0];
        }
 	}   
});