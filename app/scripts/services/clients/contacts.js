'use strict';

sentinelfApp.factory('contactFactory', ['$resource', function($resource) {

    var contactsResource = $resource( SENTINEL_API_END_POINT + '/client_contact/:contactId',
                                        {contactId: "@id" },
                                        { "update": {method:"PUT", params:{contactId: "@id"}} }
                            );

    return contactsResource;

}]);