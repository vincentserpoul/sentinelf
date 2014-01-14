'use strict';

sentinelfApp.factory('userFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    var usersResource = $resource( SENTINEL_API_END_POINT + '/users/:userId',
                                        {userId: "@id" },
                                        {
                                        	"update": {method:"PUT", params:{userId: "@id"}},
                                        	"delete": {method:"DELETE", params:{userId: "@id"}}
                                        }
                            );
    return usersResource;

}]);
