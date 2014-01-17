'use strict';

sentinelfApp.factory('modelStaticLabelsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    var modelStaticLabelsResource = $resource( SENTINEL_API_END_POINT + '/modelstaticlabels/:model',
                    {
                        model: "@model"
                    },
                    {
                        "get": {
                            method:"GET",
                            cache:true
                        }
                    });

    return modelStaticLabelsResource;

}]);
