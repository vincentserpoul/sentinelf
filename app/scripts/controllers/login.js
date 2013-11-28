'use strict';

sentinelfApp.controller('LoginCtrl', ['$scope', '$location', 'AuthenticationService', 'AlertService', function($scope, $location, AuthenticationService, AlertService) {
	$scope.credentials = { email: '', password : '', _token: ''};

	function init() {
		AuthenticationService.token().success(function(response){
			$scope.credentials._token = response;
		})
	}

	init();

	$scope.login = function() {
		AuthenticationService.login(
			$scope.credentials, 
			function(response) {
				$location.path('/');
			}, 
			function(response) {
				AlertService.show({ "message": response.message, "type": "alert-warning" }, false);  
			}
		);
	}

	$scope.logout = function() {
		AuthenticationService.logout(
			function(response) {
				$location.path('/login');
				AlertService.show({ "message": response.message, "type": "alert-success"}, true);
			}, 
			function() {
				AlertService.show({ "message": response.message, "type": "alert-danger" }, false);  
			}
		);
	}

	$scope.closeAlert = function() {
		AlertService.clear();
	}
}]);