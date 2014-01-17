'use strict';

function change () {
    alert('on change');
}

sentinelfApp.controller('UserCtrl', ['$scope', 'crud', function ($scope, crud) { 
    var obj = "user";
    $scope.viewTemplate = 'views/administration/users/userView.html';
    $scope.editTemplate = 'views/administration/users/userEdit.html';
    $scope.userTemplate = $scope.viewTemplate;

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