'use strict';

/* Lazy loading of the client list */
sentinelfApp.factory('clientsLazyloadFactory', ['clientsFactory', function(clientsFactory) {

    var clientsLazyloadFactory = function(searchCriterias) {
        this.clients = [];
        this.nextpage = 1;
        this.completelyLoaded = false;
        this.busyLoadingClients = false;
        this.total = null;
    };

    /* Create the function for the object (called prototyping in js) */
    clientsLazyloadFactory.prototype.loadMore = function() {
        /* If the list os already complete, no need to reload it */
        if(this.completelyLoaded) return;

        /* Do not call next page multiple times */
        if(this.busyLoadingClients) return;

        /* activate the business just before calling the service */
        this.busyLoadingClients = true;

        /* Get the client list, page by page */
        clientsFactory.get({page:this.nextpage}, function(data){
            /* Push each client in the main list */
            angular.forEach(data['clients'], function(client){
                this.push(client);
            }, this.clients);


            /* update the current page */
            if(data['current_page'] < data['last_page']){
                this.nextpage =  data['current_page']+1;
            } else {
                this.completelyLoaded = true;
            }
            this.busyLoadingClients = false;

            /* to display the total */
            this.total = data['total'];

        }.bind(this)); /* bind is to associate the params to object properties, I guess...? */
    };

    return clientsLazyloadFactory;
}]);
