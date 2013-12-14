'use strict';

sentinelfApp.factory('employeesFactory', ['$resource', function($resource) {

    var employeesResource = $resource('http://dev.sentinelb.com/api/v1/employee/:employeeId',
                                        {employeeId: "@id"},
                                        {
                                        	"update": {method:"PUT", params:{employeeId: "@id"}},
											"delete": {method:"DELETE", params:{employeeId: "@id"}}
                                    	}
                            );

    return employeesResource;
}]);

sentinelfApp.factory('employeesGlobaleventPeriodFactory', ['$resource', function($resource) {

    var employeesResource = $resource('http://dev.sentinelb.com/api/v1/employee/:employeeId/globalevent_period',
                                        {employeeId: "@id"}
                            );

    return employeesResource;
}]);

sentinelfApp.factory('employeesGlobaleventPeriodUnpaidFactory', ['$resource', function($resource) {

    var employeesResource = $resource('http://dev.sentinelb.com/api/v1/employee/:employeeId/unpaid_globalevent_period',
                                        {employeeId: "@id"}
                            );

    return employeesResource;
}]);
