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
				AlertService.show({ "message": response.message, "type": "success"});
			}, 
			function(response) {
				AlertService.show({ "message": response.message, "type": "error" });  
			}
		);
	}

	$scope.logout = function() {
		AuthenticationService.logout(
			function(response) {
				$location.path('/login');
				AlertService.show({ "message": response.message, "type": "success"});
			}, 
			function() {
				AlertService.show({ "message": response.message, "type": "error" });  
			}
		);
	}

	$scope.closeAlert = function() {
		AlertService.clear();
	}
}]);