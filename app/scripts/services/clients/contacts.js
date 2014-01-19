'use strict';

sentinelfApp.factory('contactsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    var contactsResource = $resource( SENTINEL_API_END_POINT + '/client_contact/:contactId',
                                        {contactId: "@id" },
                                        { "update": {method:"PUT", params:{contactId: "@id"}} }
                            );

    return contactsResource;

}]);