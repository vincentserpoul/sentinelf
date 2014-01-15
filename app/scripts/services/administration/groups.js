'use strict';

sentinelfApp.factory('groupFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    var groupsResource = $resource( SENTINEL_API_END_POINT + '/groups/:groupId',
                                        {groupId: "@id" },
                                        {
                                        	"update": {method:"PUT", params:{groupId: "@id"}},
                                        	"delete": {method:"DELETE", params:{groupId: "@id"}}
                                        }
                            );
    return groupsResource;

}]);
