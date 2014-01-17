'use strict';

sentinelfApp.factory('modelIsoLabelsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    var modelIsoLabelsResource = $resource( SENTINEL_API_END_POINT + '/modelisolabels/:model',
                    {
                        model: "@model"
                    },
                    {
                        "get": {
                            method:"GET", 
                            cache: true
                        }
                    });

    return modelIsoLabelsResource;

}]);
