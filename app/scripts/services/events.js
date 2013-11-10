'use strict';

sentinelfApp.factory('eventsFactory', ['$resource', function($resource) {

    var eventsResource = $resource('http://dev.sentinelb.com/api/v1/globalevent/:eventId',
                                {eventId: "@id" },
                                {"update": {method:"PUT", params:{eventId: "@id"}} },
                                {"delete": {method:"DELETE", params:{eventId: "@id"}} }
                            );

    return eventsResource;

}]);


sentinelfApp.factory('eventPeriodFactory', ['$resource', function($resource) {

    var eventsResource = $resource('http://dev.sentinelb.com/api/v1/globalevent_period/:eventPeriodId',
        {eventPeriodId: "@id" },
        {"update": {method:"PUT", params:{eventPeriodId: "@id"}} },
        {"delete": {method:"DELETE", params:{eventPeriodId: "@id"}} }
    );

    return eventsResource;

}]);