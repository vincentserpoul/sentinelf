'use strict';

sentinelfApp.factory('modelStaticLabelsFactory', ['$resource', function($resource) {

    var modelStaticLabelsResource = $resource('http://dev.sentinelb.com/api/v1/modelstaticlabels/:model',
                    {
                        model: "@model"
                    },
                    {
                        "get": {
                            method:"GET"
                        }
                    });

    return modelStaticLabelsResource;

}]);
