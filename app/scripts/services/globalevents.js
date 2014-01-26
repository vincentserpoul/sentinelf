'use strict';

sentinelfApp.factory('globaleventsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/globalevent/:globaleventId/:subResource/',
                {
                    globaleventId: "@id",
                    subResource: "@subResource"
                },
                {
                    "get": {method:"GET"},
                    "create": {method:"POST"},
                    "update": {method:"PUT"},
                    "delete": {method:"DELETE"},
                    "getGlobaleventPeriods": {method:"GET", params:{globaleventId: "@id", subResource: "globalevent_periods"}}
                }
            );

}]);


sentinelfApp.factory('globaleventPeriodsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/globalevent_periods/:globaleventPeriodId/',
                    {globaleventPeriodId: '@id'},
                    {
                        "get": {method:"GET"},
                        "create": {method:"POST"},
                        "update": {method:"PUT", params:{globaleventPeriodId: "@id"}},
                        "delete": {method:"DELETE", params:{globaleventPeriodId: "@id"}},
                        "getAssignedEmployees": {method:"GET", params:{globaleventPeriodId: "@id"}}
                    });
}])

sentinelfApp.factory('globaleventPeriodsEmployeeFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/globalevent_period_employee/:eventPeriodEmployeeId',
                {eventPeriodEmployeeId: "@id" },
                {"update": {method:"PUT", params:{globaleventPeriodEmployeeId: "@id"}} },
                {"delete": {method:"DELETE", params:{globaleventPeriodEmployeeId: "@id"}} }
            );

}])

sentinelfApp.factory('wholeEventFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/globalevent_period_employee/assign_whole_event');

}])
