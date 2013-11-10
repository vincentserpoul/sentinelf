'use strict';

sentinelfApp.factory('groupsFactory', ['$resource', function($resource) {

    var groupsResource = $resource('http://dev.sentinelb.com/api/v1/groups/:groupId',
                                        {groupId: "@id" },
                                        { 
                                        	"update": {method:"PUT", params:{groupId: "@id"}},
                                        	"delete": {method:"DELETE", params:{groupId: "@id"}}
                                        }
                            );
    return groupsResource;

}]);