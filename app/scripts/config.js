'use strict';

sentinelfApp.config(['$routeProvider', '$locationProvider', '$httpProvider', '$sceDelegateProvider', 'SENTINEL_API_END_POINT',
    function($routeProvider, $locationProvider, $httpProvider, $sceDelegateProvider, SENTINEL_API_END_POINT){
    /* To enable CORS AJAX requests */
    $sceDelegateProvider.resourceUrlWhitelist(['self', SENTINEL_API_END_POINT+'**']);
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.xsrfCookieName = 'laravel_session';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $routeProvider.when('/',
        {
            templateUrl:    '/views/employees/employeesList.html',
            controller:     'EmployeesListCtrl',
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
            templateUrl:    '/views/globalevents/globaleventsList.html',
            controller:     'GlobaleventsListCtrl',
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
        };
    });
}]);
