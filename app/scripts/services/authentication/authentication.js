'use strict';

sentinelfApp.factory('AuthenticationService', ['$http', 'SENTINEL_API_END_POINT', function($http, SENTINEL_API_END_POINT){

	var currentUser = {email: '', userRole: {title: 'public', permissions: ['public']}};

	var xhr = new XMLHttpRequest();
	xhr.open('GET', SENTINEL_API_END_POINT + '/auth/state', false);
	xhr.useXDomain = true;
	xhr.withCredentials = true;
	xhr.send(null);

	if(xhr.status === 200){
		currentUser = JSON.parse(xhr.responseText).user;
	}

	function changeUser(user){
		angular.extend(currentUser, user);
	}

	return {
		authorize: function(permissions) {
			if(!permissions){
				return true;
			}
			if(!permissions.length){
				return true;
			}
			for(var i = 0; i < permissions.length; i++){
				if(currentUser.userRole.permissions.indexOf(permissions[i]) > -1){
					return true;
				}
			}
			return false;
		},
		isLoggedIn: function(user) {
			if(user === undefined){
				user = currentUser;
			}
			return (user.userRole.permissions.indexOf('public') === -1) && user.userRole.permissions.length;
		},
		register: function(user, success, error) {
			$http({
				url: SENTINEL_API_END_POINT + '/auth/register',
				method: 'POST',
				data: user,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				withCredentials: true,
				transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj){
						str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                    }
                    return str.join('&');
                }
			}).success(success).error(error);
		},
		login: function(user, success, error) {
			var login =  $http({
				url: SENTINEL_API_END_POINT + '/auth/login',
				method: 'POST',
				data: user,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				withCredentials: true,
				transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj){
						str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
					}
                    return str.join('&');
                }
			});
			login.success(function(response){
				changeUser(response.user);
				success(response);
			});
			login.error(error);
			return login;
		},
		logout: function(success, error) {
			var logout = $http({
				url: SENTINEL_API_END_POINT + '/auth/logout',
				method: 'GET',
				withCredentials: true
			});
			logout.success(function(response){
				changeUser(response.user);
				success(response);
			});
			logout.error(error);
			return logout;
		},
		token: function() {
			var token = $http({
				url: SENTINEL_API_END_POINT + '/auth/token',
				method: 'GET',
				withCredentials: true
			});
			return token;
		},
        user: currentUser
	};
}]);
