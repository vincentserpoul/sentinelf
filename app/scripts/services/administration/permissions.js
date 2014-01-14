'use strict';

sentinelfApp.factory('permissionsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    var permissionsResource = $resource( SENTINEL_API_END_POINT + '/permissions/:permissionId',
                                        {permissionId: "@id" },
                                        {
                                        	"update": {method:"PUT", params:{permissionId: "@id"}},
                                        	"delete": {method:"DELETE", params:{permissionId: "@id"}}
                                        }
                            );
    return permissionsResource;

}]);
