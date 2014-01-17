'use strict';

/* Lazy loading of the contact list */
sentinelfApp.factory('contactsLazyloadFactory', ['contactsFactory', function(contactsFactory) {

    var contactsLazyloadFactory = function(client_id) {
        this.contacts = [];
        this.client_id = client_id;
        this.nextpage = 1;
        this.completelyLoaded = false;
        this.busyLoadingContacts = false;
        this.total = null;
    };

    /* Create the function for the object (called prototyping in js) */
    contactsLazyloadFactory.prototype.loadMore = function() {
        /* If the list os already complete, no need to reload it */
        if(this.completelyLoaded) return;

        /* Do not call next page multiple times */
        if(this.busyLoadingContacts) return;

        /* activate the business just before calling the service */
        this.busyLoadingContacts = true;

        /* Get the contact list, page by page */
        contactsFactory.get({client_id: this.client_id, page:this.nextpage}, function(data){
            /* Push each contact in the main list */
            angular.forEach(data['ClientContacts'], function(contact){
                this.push(contact);
            }, this.contacts);


            /* update the current page */
            if(data['current_page'] < data['last_page']){
                this.nextpage =  data['current_page']+1;
            } else {
                this.completelyLoaded = true;
            }
            this.busyLoadingContacts = false;

            /* to display the total */
            this.total = data['total'];

        }.bind(this)); /* bind is to associate the params to object properties, I guess...? */
    };

    return contactsLazyloadFactory;
}]);
