'use strict';

sentinelfApp.controller('AdministrationCtrl', ['$scope', 'usersFactory', 'groupsFactory', 'permissionsFactory', 'UsersGroupsService', function($scope, usersFactory, groupsFactory, permissionsFactory, UsersGroupsService){
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
		usersFactory.get(function(data){
			// get users' data
			$scope.users = data['users'];
			groupsFactory.get(function(data){
				// get groups' data
				$scope.groups = data['groups'];
				// merge users and groups permissions
				UsersGroupsService.merge($scope.users, $scope.groups);
				// get permissions
				permissionsFactory.get(function(data){
					$scope.permissions = data['permissions'];
				});
			});
		});
	}
}])