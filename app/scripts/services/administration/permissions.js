'use strict';

sentinelfApp.factory('permissionsFactory', ['$resource', function($resource) {

    var permissionsResource = $resource('http://dev.sentinelb.com/api/v1/permissions/:permissionId',
                                        {permissionId: "@id" },
                                        { 
                                        	"update": {method:"PUT", params:{permissionId: "@id"}},
                                        	"delete": {method:"DELETE", params:{permissionId: "@id"}}
                                        }
                            );
    return permissionsResource;

}]);