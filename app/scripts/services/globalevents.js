'use strict';

sentinelfApp.factory('globaleventsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/globalevent/:globaleventId/:subResource/',
    {
        globaleventId: '@id',
        subResource: '@subResource'
    },
    {
        'get': {method:'GET'},
        'create': {method:'POST'},
        'update': {method:'PUT'},
        'delete': {method:'DELETE'},
        'getGlobaleventPeriods': {method:'GET', params:{globaleventId: '@id', subResource: 'globalevent_periods'}}
    }
);

}]);


sentinelfApp.factory('globaleventPeriodsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/globalevent_period/:globaleventPeriodId/:subResource/',
    {
        globaleventPeriodId: '@id',
        subResource: '@subResource'
    },
    {
        'get': {method:'GET'},
        'create': {method:'POST'},
        'update': {method:'PUT'},
        'delete': {method:'DELETE'},
        'getAssignedEmployees': {method:'GET', params:{globaleventPeriodId: '@id', subResource: 'assigned_employees'}}
    }
);
}]);

sentinelfApp.factory('globaleventPeriodEmployeesFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/globalevent_period_employee/:globaleventPeriodEmployeeId');

}]);
