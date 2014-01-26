'use strict';

sentinelfApp.factory('clientDepartmentsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    var clientDepartmentsResource = $resource( SENTINEL_API_END_POINT + '/client_department/:departmentId',
                                        {departmentId: "@id" },
                                        {
                                        	"update": {method:"PUT", params:{departmentId: "@id"}},
                                        	"delete": {method:"DELETE", params:{departmentId: "@id"}}
                                        }
                            );
    return clientDepartmentsResource;

}]);
