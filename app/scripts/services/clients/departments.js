'use strict';

sentinelfApp.factory('departmentFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    var departmentsResource = $resource( SENTINEL_API_END_POINT + '/client_department/:departmentId',
                                        {departmentId: "@id" },
                                        { 
                                        	"update": {method:"PUT", params:{departmentId: "@id"}},
                                        	"delete": {method:"DELETE", params:{departmentId: "@id"}}
                                        }
                            );
    return departmentsResource;

}]);