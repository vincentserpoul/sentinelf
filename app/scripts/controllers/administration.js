'use strict';

sentinelfApp.controller('AdministrationCtrl', ['$scope', 'userFactory', 'groupsFactory', 'permissionsFactory', 'UsersGroupsService', function($scope, userFactory, groupsFactory, permissionsFactory, UsersGroupsService){
	$scope.tabs = [
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
	

	$scope.select = function(tab){		
		$scope.selection = tab.title;
	}

	init();

	function init(){
		userFactory.get(function(data){
			// get users' data
			$scope.users = data['users'];
			groupsFactory.get(function(data){
				// get groups' data
				$scope.groups = data['groups'];
				// get permissions
				permissionsFactory.get(function(data){
					$scope.permissions = data['permissions'];
					$scope.groupPermissions = {};
					for(var i = 0; i < $scope.permissions.length; i++){
			            $scope.groupPermissions[$scope.permissions[i]] = {
			                'name': $scope.permissions[i],
			                'isPermitted': false
			            }
			        }
				});
			});
		});
	}
}])