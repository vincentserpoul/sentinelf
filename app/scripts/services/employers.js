'use strict';

sentinelfApp.factory('employersFactory', ['$resource', function($resource) {

    var employersResource = $resource('http://dev.sentinelb.com/api/v1/employer/:employerId',
                                        {employerId: "@id"},
                                        {
                                        	"update": {method:"PUT", params:{employerId: "@id"}},
											"delete": {method:"DELETE", params:{employerId: "@id"}}
                                    	}
                            );


    return employersResource;

}]);