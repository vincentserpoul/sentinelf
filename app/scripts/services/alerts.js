'use strict'; 

sentinelfApp.factory('AlertService', function($rootScope){
	$rootScope.alerts = [];

	return {
		show: function(alert){
			$rootScope.alerts[0] = alert;
		}, 
		clear: function(){
			$rootScope.alerts = [];
		}
	}
})