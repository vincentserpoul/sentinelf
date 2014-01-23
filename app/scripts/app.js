'use strict';

var sentinelfApp = angular.module('sentinelfApp', [
    'ui.bootstrap',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'angularTreeview',
    'ngAnimate',
    'infinite-scroll',
    'configuration',
    'ui.select2'
    ])
.config(['$routeProvider', '$locationProvider', '$httpProvider', '$sceDelegateProvider', function($routeProvider, $locationProvider, $httpProvider, $sceDelegateProvider){
    /* To enable CORS AJAX requests */
    $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://dev.sentinelb.com/**']);
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.xsrfCookieName = 'laravel_session';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $routeProvider.when('/',
        {
            templateUrl:    '/views/main.html',
            controller:     'MainCtrl',
            access:         ['user']
        })
    .when('/login',
        {
            templateUrl:    '/views/login.html',
            controller:     'LoginCtrl',
            access:         ['public']
        })
    .when('/register',
        {
            templateUrl:    '/views/register.html',
            controller:     'RegisterCtrl',
            access:         ['public']
        })
    .when('/employees',
        {
            templateUrl:    '/views/employees/employeesList.html',
            controller:     'EmployeesListCtrl',
            access:         ['user']
        })
    .when('/clients',
        {
            templateUrl:    '/views/clients/clientsList.html',
            controller:     'ClientsCtrl',
            access:         ['user']
        })
    .when('/events',
        {
            templateUrl:    '/views/events/eventsList.html',
            controller:     'EventsCtrl',
            access:         ['user']
        })
    .when('/assignments',
        {
            templateUrl:    '/views/assignments/assign.html',
            controller:     'AssignmentsCtrl',
            access:         ['user']
        })
    .when('/administration',
        {
            templateUrl:    'views/administration/administrationList.html',
            controller:     'AdministrationCtrl',
            access:         ['admin']
        })
    .when('/test',
        {
            templateUrl:    'views/test.html',
            controller:     'ClientsCtrl',
            access:         ['admin']
        })
    .when('/404',
        {
            templateUrl:    '/views/404.html',
            access:         []
        });

    $routeProvider.otherwise({redirectTo:'/404', access: []});

    /* To enable clean routing without # */
    $locationProvider.html5Mode(false);
    //$locationProvider.html5Mode(false);

    // if cookie expires, redirect user to login page
    $httpProvider.interceptors.push(function ($q, $location, $rootScope) {
        return {
            response: function (response) {
                return response || $q.when(response);
            },
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    $rootScope.$broadcast('logout');
                }
                return $q.reject(rejection);
            }
        }
    })
}])
.run(['$rootScope', '$location', 'AuthenticationService', 'AlertService', function ($rootScope, $location, AuthenticationService, AlertService) {

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        $rootScope.error = null;
        if (!AuthenticationService.authorize(next.access)) {
            if(AuthenticationService.isLoggedIn()) $location.path('/');
            else {
                AlertService.show({ 'message': 'Please login to continue', 'type': 'alert-warning'}, true);
                $location.path('/login');
            }
        }
    });

    $rootScope.$on("logout", function () {
        AuthenticationService.logout(
            function(response) {
                $location.path('/login');
                AlertService.show({ "message": response.message, "type": "alert-success"}, true);
            }, 
            function() {
                AlertService.show({ "message": response.message, "type": "alert-danger" }, false);  
            }
        );
    })

}]);
