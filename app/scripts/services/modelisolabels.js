'use strict';

sentinelfApp.factory('modelIsoLabelsFactory', ['$resource', function($resource) {

    var modelIsoLabelsResource = $resource('http://dev.sentinelb.com/api/v1/modelisolabels/:model',
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
