'use strict';

sentinelfApp.factory('AlertService', function($rootScope, $timeout){
	$rootScope.alerts = [];

	return {
		show: function(alert, autoClose){
			$rootScope.alerts[0] = alert;
			if (autoClose) {
				$timeout(function () {
					$rootScope.alerts = [];
				}, 2000);
			}
		},
		clear: function(){
			$rootScope.alerts = [];
		}
	}
})
