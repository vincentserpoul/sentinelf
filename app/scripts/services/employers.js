'use strict';

sentinelfApp.factory('employersFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    var employersResource = $resource( SENTINEL_API_END_POINT + '/employer/:employerId',
                                        {employerId: "@id"},
                                        {
                                        	"update": {method:"PUT", params:{employerId: "@id"}},
											"delete": {method:"DELETE", params:{employerId: "@id"}}
                                    	}
                            );


    return employersResource;

}]);
