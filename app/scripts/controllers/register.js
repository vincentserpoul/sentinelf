'use strict';

sentinelfApp.controller('RegisterCtrl', ['$scope', 'AuthenticationService', 'AlertService',
	function($scope, AuthenticationService, AlertService){
		$scope.credentials = {email: '', password: '', password_confirmation: '', _token: ''};

		function init(){
			AuthenticationService.token().success(function(response){
				$scope.credentials._token = response;
			});
			AlertService.clear();
		}

		init();

		$scope.register = function() {
			AuthenticationService.register(
				$scope.credentials,
				function(response) {
					AlertService.show({ 'message': response.message, 'type': 'success'});
				},
				function(response) {
					AlertService.show({ 'message': response.message, 'type': 'error' });
				}
			);
		};
	}
]);
