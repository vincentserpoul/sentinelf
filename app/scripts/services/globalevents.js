'use strict';

sentinelfApp.factory('globaleventsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/globalevent/:eventId',
                {eventId: "@id" },
                {
                    "get": {method:"GET"},
                    "create": {method:"POST"},
                    "update": {method:"PUT", params:{eventId: "@id"}},
                    "delete": {method:"DELETE", params:{eventId: "@id"}}
                }
            );

}]);


sentinelfApp.factory('globaleventPeriodsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/globalevent/globalevent_periods/:globalevent_id',
                    {globalevent_id: '@id'},{"get": {method:"GET", cache: true}});
}])


sentinelfApp.factory('globaleventPeriodsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/globalevent_period/:globaleventPeriodId',
                {globaleventPeriodId: "@id" },
                {"update": {method:"PUT", params:{globaleventPeriodId: "@id"}} },
                {"delete": {method:"DELETE", params:{globaleventPeriodId: "@id"}} }
            );

}]);

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
