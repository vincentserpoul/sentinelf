'use strict';

<<<<<<< HEAD
sentinelfApp.factory('userFactory', ['$resource', function($resource) {
=======
sentinelfApp.factory('usersFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {
>>>>>>> master

    var usersResource = $resource( SENTINEL_API_END_POINT + '/users/:userId',
                                        {userId: "@id" },
                                        {
                                        	"update": {method:"PUT", params:{userId: "@id"}},
                                        	"delete": {method:"DELETE", params:{userId: "@id"}}
                                        }
                            );
    return usersResource;

}]);
