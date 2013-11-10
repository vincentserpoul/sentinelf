'use strict';

sentinelfApp.factory('usersFactory', ['$resource', function($resource) {

    var usersResource = $resource('http://dev.sentinelb.com/api/v1/users/:userId',
                                        {userId: "@id" },
                                        { 
                                        	"update": {method:"PUT", params:{userId: "@id"}},
                                        	"delete": {method:"DELETE", params:{userId: "@id"}}
                                        }
                            );
    return usersResource;

}]);