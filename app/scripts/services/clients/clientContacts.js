'use strict';

sentinelfApp.factory('clientContactsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    var clientContactsResource = $resource( SENTINEL_API_END_POINT + '/client_contact/:clientContactId',
                                        {clientContactId: "@id" },
                                        { "update": {method:"PUT", params:{clientContactId: "@id"}} }
                            );

    return clientContactsResource;

}]);
