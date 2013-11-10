'use strict';

sentinelfApp.factory('contactsFactory', ['$resource', function($resource) {

    var contactsResource = $resource('http://dev.sentinelb.com/api/v1/employer_contact/:contactId',
                                        {contactId: "@id" },
                                        { "update": {method:"PUT", params:{contactId: "@id"}} }
                            );

    return contactsResource;

}]);