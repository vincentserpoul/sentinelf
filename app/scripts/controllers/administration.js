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
			$scope.users = data['users'];
		}).$then(function(){
			groupsFactory.get(function(data){
				$scope.groups = data['groups'];
			}).$then(function(data){
				UsersGroupsService.merge($scope.users, $scope.groups);
				permissionsFactory.get(function(data){
					$scope.permissions = data['permissions'];
				})
			});
		});		
	}
}])