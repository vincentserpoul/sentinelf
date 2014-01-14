'use strict';

sentinelfApp.factory('eventFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/globalevent/:eventId',
                {eventId: "@id" },
                {"update": {method:"PUT", params:{eventId: "@id"}} },
                {"delete": {method:"DELETE", params:{eventId: "@id"}} }
            );

}]);


sentinelfApp.factory('eventPeriodFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/globalevent_period/:eventPeriodId',
                {eventPeriodId: "@id" },
                {"update": {method:"PUT", params:{eventPeriodId: "@id"}} },
                {"delete": {method:"DELETE", params:{eventPeriodId: "@id"}} }
            );

}]);

sentinelfApp.factory('eventPeriodEmployeeFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/globalevent_period_employee/:eventPeriodEmployeeId',
                {eventPeriodEmployeeId: "@id" },
                {"update": {method:"PUT", params:{eventPeriodEmployeeId: "@id"}} },
                {"delete": {method:"DELETE", params:{eventPeriodEmployeeId: "@id"}} }
            );

}])

sentinelfApp.factory('wholeEventFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/globalevent_period_employee/assign_whole_event');

}])

sentinelfApp.factory('eventPeriodsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    return $resource( SENTINEL_API_END_POINT + '/globalevent/globalevent_periods/:globalevent_id',
                    {globalevent_id: '@id'},{"get": {method:"GET", cache: true}});
}])
