'use strict';

sentinelfApp.controller('UsersCtrl', ['$scope', 'usersFactory', '$dialog', 'UsersGroupsService', function($scope, usersFactory, $dialog, UsersGroupsService){
	
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

        var name = "Delete user";
        var msg = "Are you sure you want to delete user "
                    + user.email + "?";

        var btns = [{result: 'cancel', label: 'Cancel'}, {result: 'confirm', label: 'Confirm', cssClass: 'btn-primary'}];

        $dialog.messageBox(name, msg, btns)
        .open()
        .then(function(result){
            if(result == 'confirm'){
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
            }
        });
    }

}])