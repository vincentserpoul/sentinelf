'use strict';

sentinelfApp.controller('GroupsCtrl', ['$scope', 'crud', 'groupFactory', 'UsersGroupsService', 'AlertService', function ($scope, crud, groupFactory, UsersGroupsService, AlertService) {

    var obj = "group";
    var notLazyLoad = true;
    var newGroupPermissions = angular.copy($scope.groupPermissions);
    var preselectedValues = {
            'name': 'new group name',
            'group_permissions': newGroupPermissions
        };

    $scope.groupTemplate = 'views/administration/groups/groupView.html';

    $scope.newGroup = function () {
        crud.new($scope, obj, preselectedValues);
    }

    $scope.saveNewGroup = function () {
        crud.create($scope, obj, notLazyLoad);
    }

    $scope.cancelNewGroup = function () {
        crud.cancelNew($scope, obj);
    }

}])

sentinelfApp.controller('GroupCtrl', ['$scope', 'crud', 'formService', 'AlertService', 'groupFactory', 'UsersGroupsService', function ($scope, crud, formService, AlertService, groupFactory, UsersGroupsService) {

    var obj = "group";
    var notLazyLoad = true;

    $scope.editGroup = function () {
        crud.edit($scope, obj);
    }

    $scope.saveGroup = function () {
        /* Call the factory to update the group in db */
        crud.save($scope, obj);
    }

    $scope.cancelEditGroup = function () {
        crud.cancelEdit($scope, obj);
    }

    /* Delete group button for each group */
    $scope.deleteGroup = function () {
        crud.delete($scope, obj, notLazyLoad);
    }
}]);

/*
* create filter for property check
*/
sentinelfApp.filter('checkmark', function(){
    return function(input){
        return input ? '\u2713' : '\u2717';
    }
});