'use strict';

function change () {
    alert('on change');
}

sentinelfApp.controller('UserCtrl', ['$scope', 'crud', function ($scope, crud) { 
    var obj = "user";
    $scope.userTemplate = 'views/administration/users/userView.html';

    $scope.editUser = function () {
        crud.edit($scope, obj);
    }

    $scope.saveEditUser = function () {
        $scope.user.groups = new Array();
        angular.forEach($scope.groups, function (value, key) {
            if (angular.element('#groupCheck' + $scope.user.id + value.id).prop('checked')) 
                $scope.user.groups.push(value.id);
        });
        crud.save($scope, obj);
    };

    $scope.cancelEditUser = function () {
        crud.cancelEdit($scope, obj);   
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

/*
* create filter for property check
*/
sentinelfApp.filter('inGroupCheckmark', function(){
    return function(input, user){
        return user.groups.filter(function(value, index){return value === input.id}).length ? '\u2713' : '\u2717';
    }
});

sentinelfApp.filter('inGroup', function(){
    return function(input, user){
        return user.groups.filter(function(value, index){return value === input.id}).length ? true : false;
    }
});