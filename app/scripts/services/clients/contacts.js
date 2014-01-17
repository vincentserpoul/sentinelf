'use strict';

sentinelfApp.factory('contactFactory', ['$resource', function($resource) {

    var contactsResource = $resource('http://dev.sentinelb.com/api/v1/client_contact/:contactId',
                                        {contactId: "@id" },
                                        { "update": {method:"PUT", params:{contactId: "@id"}} }
                            );

    return contactsResource;

}]);