'use strict';

/* Lazy loading of the employee list */
sentinelfApp.factory('eventsLazyloadFactory', ['eventsFactory', function(eventsFactory) {

    var eventsLazyloadFactory = function () {
        this.events = [];
        this.nextpage = 1;
        this.completelyLoaded = false;
        this.busyLoadingEvents = false;
        this.total = 0;
    };

    /* Create the function for the object (called prototyping in js) */
    eventsLazyloadFactory.prototype.loadMore = function () {
        /* If the list os already complete, no need to reload it */
        if(this.completelyLoaded) return;

        /* Do not call next page multiple times */
        if(this.busyLoadingEvents) return;

        /* activate the business just before calling the service */
        this.busyLoadingEvents = true;

        /* Get the employee list, page by page */
        eventsFactory.get({page:this.nextpage}, function(data){
            this.events = this.events.concat(data['Globalevents']);

            /* update the current page */
            if(data['current_page'] < data['last_page']){
                this.nextpage =  data['current_page']+1;
            } else {
                this.completelyLoaded = true;
            }
            this.busyLoadingEvents = false;

            /* to display the total */
            this.total = data['total'];

        }.bind(this)); /* bind is to associate the params to object properties, I guess...? */
    };

    return eventsLazyloadFactory;
}]);
