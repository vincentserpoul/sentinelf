'use strict';

sentinelfApp.factory('departmentsFactory', ['$resource', function($resource) {

    var departmentsResource = $resource( SENTINEL_API_END_POINT + '/client_department/:departmentId',
                                        {departmentId: "@id" },
                                        { 
                                        	"update": {method:"PUT", params:{departmentId: "@id"}},
                                        	"delete": {method:"DELETE", params:{departmentId: "@id"}}
                                        }
                            );
    return departmentsResource;

}]);