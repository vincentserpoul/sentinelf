'use strict';

sentinelfApp.controller('UsersCtrl', ['$scope', 'formService', 'usersFactory', 'UsersGroupsService', function($scope, formService, usersFactory, UsersGroupsService){
	
	$scope.editUser = function(user){
		usersFactory.update(user, function(data){
			if(data && data['error'] == false){
				$scope.$parent.$parent.users = data['users'];
				UsersGroupsService.merge($scope.$parent.$parent.users, $scope.$parent.$parent.groups);
			}
		});
	};

	/* Delete user button for each user */
    $scope.deleteUser = function(user){

        var modalInstance = formService.popup('user', user.email);

        //when confirmed 
        modalInstance.result.then(function () {
            usersFactory.delete({userId:user.id},
                function(data){
                    if(data && data['error'] == false){
                        $scope.$parent.$parent.users = data['users'];
                        UsersGroupsService.merge($scope.$parent.$parent.users, $scope.$parent.$parent.groups);
                    } else {
                        console.log(data['error']);
                    }
                }
            );
        })
    }
}])