'use strict';

sentinelfApp.run(['$rootScope', '$location', 'AuthenticationService', 'AlertService', function ($rootScope, $location, AuthenticationService, AlertService) {

    $rootScope.$on('$routeChangeStart', function (event, next) {
        $rootScope.error = null;
        if (!AuthenticationService.authorize(next.access)) {
            if(AuthenticationService.isLoggedIn()){
                $location.path('/');
            }
            else {
                AlertService.show({ 'message': 'Please login to continue', 'type': 'alert-warning'}, true);
                $location.path('/login');
            }
        }
    });

    $rootScope.$on('logout', function () {
        AuthenticationService.logout(
            function(response) {
                $location.path('/login');
                AlertService.show({ 'message': response.message, 'type': 'alert-success'}, true);
            },
            function(response) {
                AlertService.show({ 'message': response.message, 'type': 'alert-danger' }, false);
            }
        );
    });

}]);
