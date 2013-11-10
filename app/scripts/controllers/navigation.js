'use strict';

sentinelfApp.controller('NavigationCtrl',['$scope', '$location', 'AuthenticationService', function($scope, $location, AuthenticationService) {
    $scope.user = AuthenticationService.user;

    $scope.routeIs = function(routeName) {
        return $location.path() === routeName;
    };

    $scope.go = function ( hash ) {
        $location.hash( hash );
    };
}]);
