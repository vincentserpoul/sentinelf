'use strict';

var sentinelfApp = angular.module('sentinelfApp', [
    'ui.bootstrap',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'angularTreeview',
    'http-auth-interceptor',
    'ngAnimate'
])
.config(['$routeProvider', '$locationProvider', '$httpProvider', '$sceDelegateProvider', function($routeProvider, $locationProvider, $httpProvider, $sceDelegateProvider){
        /* To enable CORS AJAX requests */
        $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://dev.sentinelb.com/**']);
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.xsrfCookieName = 'laravel_session';
/*        delete $httpProvider.defaults.headers.common['X-Requested-With'];*/

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
        .when('/employeeview/:employeeId',
            {
                templateUrl:    '/views/employees/employeeView.html',
                controller:     'EmployeeViewCtrl',
                access:         ['user']
            })
        .when('/employeeview',
            {
                templateUrl:    '/views/employees/employeeView.html',
                controller:     'EmployeeViewCtrl',
                access:         ['user']
            })
        .when('/employers',
            {
                templateUrl:    '/views/employers/employersList.html',
                controller:     'EmployersCtrl',
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
        .when('/404',
            {
                templateUrl:    '/views/404.html',
                access:         []
            });

        $routeProvider.otherwise({redirectTo:'/404', access: []});

        /* To enable clean routing without # */
        //$locationProvider.html5Mode(true);
        $locationProvider.html5Mode(false);

        var interceptor = ['$location', '$q', function($location, $q) {
            function success(response) {
                return response;
            }

            function error(response) {

                if(response.status === 401) {
                    $location.path('/#/login');
                    return $q.reject(response);
                }
                else {
                    return $q.reject(response);
                }
            }

            return function(promise) {
                return promise.then(success, error);
            }
        }];

        $httpProvider.responseInterceptors.push(interceptor);
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

}]);
