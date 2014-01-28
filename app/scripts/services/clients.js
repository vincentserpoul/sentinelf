'use strict';

sentinelfApp.factory('clientsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    var clientsResource = $resource( SENTINEL_API_END_POINT + '/client/:clientId',
                                        {clientId: "@id"},
                                        {
                                        	"update": {method:"PUT", params:{clientId: "@id"}},
											"delete": {method:"DELETE", params:{clientId: "@id"}}
                                    	}
                            );


    return clientsResource;

}]);
