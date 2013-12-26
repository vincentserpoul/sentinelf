'use strict';

sentinelfApp.controller('UserCtrl', ['$scope', 'formService', 'AlertService', 'usersFactory', 'UsersGroupsService', function($scope, formService, AlertService, usersFactory, UsersGroupsService){
    
    $scope.editUser = function () {
        $scope.savUser = angular.copy($scope.user);
        // copy group to saved user
        $scope.savUser.group = $scope.user.group;
        $scope.editForm = true;
    }

    $scope.saveEditUser = function () {
        usersFactory.update($scope.user,
            function (data) {
                if (data) {
                    $scope.users = data['users'];
                    UsersGroupsService.merge($scope.users, $scope.groups);
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }
            }, function (error) {
                if (error['data'])
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
            }
        );
        $scope.editForm = false;
    };

    $scope.cancelEditUser = function () {
        formService.copyProps($scope.savUser, $scope.user);
        $scope.editForm = false;
    }

    /* Delete user button for each user */
    $scope.deleteUser = function(){

        var modalInstance = formService.popup('user', $scope.user.email);

        modalInstance.result.then(function(){
            usersFactory.delete({userId:$scope.user.id},
                function (data) {
                    $scope.users.splice(formService.findInArray($scope.users, $scope.user.id), 1);
                    if (data)
                        AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }, function (error) {
                    if (error['data'])
                        AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
                }
            );
        });
    }
}])