'use strict';

/* Lazy loading of the employee list */
sentinelfApp.factory('eventPeriodsLazyloadFactory', ['eventPeriodsFactory', function(eventPeriodsFactory) {

    var eventPeriodsLazyloadFactory = function (event_id) {
        this.event_id = event_id;
        this.eventPeriods = [];
        this.nextpage = 1;
        this.completelyLoaded = false;
        this.busyLoadingEventPeriods = false;
        this.total = 0;
    };

    /* Create the function for the object (called prototyping in js) */
    eventPeriodsLazyloadFactory.prototype.loadMore = function () {
        /* If the list os already complete, no need to reload it */
        if(this.completelyLoaded) return;

        /* Do not call next page multiple times */
        if(this.busyLoadingEventPeriods) return;

        /* activate the business just before calling the service */
        this.busyLoadingEventPeriods = true;

        /* Get the employee list, page by page */
        eventPeriodsFactory.get({globalevent_id: this.event_id, page:this.nextpage}, function(data){
            this.eventPeriods = this.eventPeriods.concat(data['GlobaleventPeriods']);

            /* update the current page */
            if(data['current_page'] < data['last_page']){
                this.nextpage =  data['current_page']+1;
            } else {
                this.completelyLoaded = true;
            }
            this.busyLoadingEventPeriods = false;

            /* to display the total */
            this.total = data['total'];

        }.bind(this)); /* bind is to associate the params to object properties, I guess...? */
    };

    return eventPeriodsLazyloadFactory;
}]);
