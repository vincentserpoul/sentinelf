'use strict';

sentinelfApp.factory('employeesFactory', ['$resource', function($resource) {

    return $resource('http://dev.sentinelb.com/api/v1/employee/:listFilter:employeeId/:listFilterParams/',
                    {
                        employeeId: "@employeeId",
                        listFilter: "@listFilter",
                        listFilterParams: "@listFilterParams",
                    },
                    {
                        "get": {method:"GET", cache: true},
                        "create": {method:"POST"},
                    	"update": {method:"PUT"},
        				"delete": {method:"DELETE"},
                        "search": {
                            method:"GET",
                            params: {
                                listFilter: "search",
                                listFilterParams: "@listFilterParams"
                            }
                        }
                	});
}]);

sentinelfApp.factory('employeesGlobaleventPeriodFactory', ['$resource', function($resource) {

    return $resource('http://dev.sentinelb.com/api/v1/employee/:employeeId/globalevent_period',
                    {employeeId: "@id"});
}]);

sentinelfApp.factory('employeesGlobaleventPeriodUnpaidFactory', ['$resource', function($resource) {

    return $resource('http://dev.sentinelb.com/api/v1/employee/:employeeId/unpaid_globalevent_period',
                    {employeeId: "@id"});
}]);

sentinelfApp.factory('employeesEventPeriodsFactory', ['$resource', function ($resource) {

    return $resource('http://dev.sentinelb.com/api/v1/employee/all_possible_globalevent_period/:event_id',
                    {event_id: "@id"});

}]);

sentinelfApp.factory('employeeEventPeriodsFactory', ['$resource', function ($resource) {

    return $resource('http://dev.sentinelb.com/api/v1/employee/:employee_id/possible_globalevent_period/:event_id',
                    {employee_id: "@id", event_id: "@id"});

}]);

sentinelfApp.factory('assignedEmployeesFactory', ['$resource', function ($resource) {

    return $resource('http://dev.sentinelb.com/api/v1/employee/assigned_employees/:globalevent_period_id',
                    {globalevent_period_id: "@id"});

}]);
