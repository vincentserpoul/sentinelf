'use strict';

sentinelfApp.factory('clientContactsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    var clientContactsResource = $resource( SENTINEL_API_END_POINT + '/client_contact/:contactId',
                                        {contactId: "@id" },
                                        { "update": {method:"PUT", params:{contactId: "@id"}} }
                            );

    return clientContactsResource;

}]);
