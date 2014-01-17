'use strict';

sentinelfApp.factory('departmentFactory', ['$resource', function($resource) {

    var departmentsResource = $resource('http://dev.sentinelb.com/api/v1/client_department/:departmentId',
                                        {departmentId: "@id" },
                                        { 
                                        	"update": {method:"PUT", params:{departmentId: "@id"}},
                                        	"delete": {method:"DELETE", params:{departmentId: "@id"}}
                                        }
                            );
    return departmentsResource;

}]);