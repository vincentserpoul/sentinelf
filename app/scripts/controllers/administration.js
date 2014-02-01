'use strict';

sentinelfApp.controller('AdministrationCtrl', ['$scope', 'userFactory', 'groupFactory', 'permissionsFactory',
	function($scope, userFactory, groupFactory, permissionsFactory){
		$scope.navs = [
			{
				title: 'users',
				heading: 'Users'
			},
			{
				title: 'groups',
				heading: 'Groups'
			},
			{
				title: 'permissions',
				heading: 'Permissions'
			}
		];


		$scope.select = function(nav){
			$scope.selection = nav.title;
		};


		function init(){
			userFactory.get(function(data){
				// get users' data
				$scope.users = data.users;
				groupFactory.get(function(data){
					// get groups' data
					$scope.groups = data.groups;
					// get permissions
					permissionsFactory.get(function(data){
						$scope.permissions = data.permissions;
						$scope.groupPermissions = {};
						for(var i = 0; i < $scope.permissions.length; i++){
				            $scope.groupPermissions[$scope.permissions[i]] = {
				                'name': $scope.permissions[i],
				                'isPermitted': false
				            };
				        }
					});
				});
			});
		}

		init();
	}
]);
