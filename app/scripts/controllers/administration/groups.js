'use strict';

sentinelfApp.controller('GroupsCtrl', ['$scope', 'groupsFactory', 'UsersGroupsService', 'AlertService', function ($scope, groupsFactory, UsersGroupsService, AlertService) {

    $scope.newGroup = function () {
        var newGroupPermissions = angular.copy($scope.groupPermissions);

        $scope.newGroups = [{
            'name': 'new group name',
            'permissions': newGroupPermissions
        }];

        $('#collapseNewGroup').collapse('show');
    }

    $scope.saveNewGroup = function () {
        /* Call the factory to update the new group in db */
        groupsFactory.save($scope.newGroups[0],
            function (data) {
                if (data) {
                    $scope.groups = data['groups'];
                    // merge users and groups permissions
                    UsersGroupsService.merge($scope.users, $scope.groups);
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }
            }, function (error) {
                if (error['data'])
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
            }
        );

        $('#collapseNewGroup').collapse('hide');
    }

    $scope.cancelNewGroup = function () {
        $('#collapseNewGroup').collapse('hide');
    }

}])

sentinelfApp.controller('GroupCtrl', ['$scope', 'formService', 'AlertService', 'groupsFactory', 'UsersGroupsService', function ($scope, formService, AlertService, groupsFactory, UsersGroupsService) {

    $scope.editForm = false;

    $scope.editGroup = function () {
        // Save client in case of cancel, to rollback to previous values
        $scope.savGroup = angular.copy($scope.group);
        $scope.editForm = true;
    }

    $scope.saveGroup = function () {
        /* Call the factory to update the new client in db */
        groupsFactory.update($scope.group,
            function (data) {
                if (data) {
                    // when success, reset the savClient
                    $scope.savGroup = null;
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }
            }, function (error) {
                if (error['data'])
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
            }
        );
        $scope.editForm = false;
    }

    $scope.cancelEditGroup = function () {
        // Reset the data to what it was before the edit
        $scope.group = $scope.savGroup;
        // Deactivate the edit
        $scope.editForm = false;
    }

    /* Delete group button for each group */
    $scope.deleteGroup = function () {

        var modalInstance = formService.popup('group', $scope.group.name);

        modalInstance.result.then(function(){
            groupsFactory.delete({groupId:$scope.group.id},
                function (data) {
                    $scope.groups.splice(formService.findInArray($scope.groups, $scope.group.id), 1);
                    if (data)
                        AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }, function (error) {
                    if (error['data'])
                        AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
                }
            );
        });
    }
}]);