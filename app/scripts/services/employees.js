'use strict';

sentinelfApp.factory('employeesFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/employee/:listFilter:employeeId/:listFilterParams/',
        {
            employeeId: '@employeeId',
            listFilter: '@listFilter',
            listFilterParams: '@listFilterParams',
        },
        {
            'get': {method:'GET', cache: true},
            'create': {method:'POST'},
            'update': {method:'PUT'},
            'delete': {method:'DELETE'},
            'search': {
                method:'GET',
                params: {
                    listFilter: 'search',
                    listFilterParams: '@listFilterParams'
                }
            }
        });
}]);

sentinelfApp.factory('employeesGlobaleventPeriodFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/employee/:employeeId/globalevent_period',
                    {employeeId: '@id'});
}]);

sentinelfApp.factory('employeesGlobaleventPeriodUnpaidFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/employee/:employeeId/unpaid_globalevent_period',
                    {employeeId: '@id'});
}]);

sentinelfApp.factory('employeesGlobaleventPeriodpaidFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/employee/:employeeId/paid_globalevent_period',
                    {employeeId: '@id'});
}]);

sentinelfApp.factory('employeesEventPeriodsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/employee/all_possible_globalevent_period/:event_id',
                    {event_id: '@id'});

}]);

sentinelfApp.factory('employeeEventPeriodsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/employee/:employee_id/possible_globalevent_period/:event_id',
                    {employee_id: '@id', event_id: '@id'});

}]);

sentinelfApp.factory('assignedEmployeesFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/employee/assigned_employees/:globalevent_period_id',
                    {globalevent_period_id: '@id'});

}]);

sentinelfApp.factory('employeeRemarksFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/employee/:employeeId/remark',
                    {employeeId: '@employeeId'});

}]);

sentinelfApp.factory('employeePaymentsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/employee/:employeeId/payment',
                    {employeeId: '@employeeId'});

}]);

