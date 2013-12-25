'use strict';

sentinelfApp.factory('eventsFactory', ['$resource', function($resource) {

    return $resource('http://dev.sentinelb.com/api/v1/globalevent/:eventId',
                {eventId: "@id" },
                {"update": {method:"PUT", params:{eventId: "@id"}} },
                {"delete": {method:"DELETE", params:{eventId: "@id"}} }
            );

}]);


sentinelfApp.factory('eventPeriodFactory', ['$resource', function ($resource) {

    return $resource('http://dev.sentinelb.com/api/v1/globalevent_period/:eventPeriodId',
                {eventPeriodId: "@id" },
                {"update": {method:"PUT", params:{eventPeriodId: "@id"}} },
                {"delete": {method:"DELETE", params:{eventPeriodId: "@id"}} }
            );

}]);

sentinelfApp.factory('eventPeriodEmployeeFactory', ['$resource', function ($resource) {

    return $resource('http://dev.sentinelb.com/api/v1/globalevent_period_employee/:eventPeriodEmployeeId',
                {eventPeriodEmployeeId: "@id" },
                {"update": {method:"PUT", params:{eventPeriodEmployeeId: "@id"}} },
                {"delete": {method:"DELETE", params:{eventPeriodEmployeeId: "@id"}} }
            );

}])

sentinelfApp.factory('wholeEventFactory', ['$resource', function ($resource) {

    return $resource('http://dev.sentinelb.com/api/v1/globalevent_period_employee/assign_whole_event');

}])