'use strict';

/* Lazy loading of the employee list */
sentinelfApp.factory('globaleventsLazyloadFactory', ['globaleventsFactory', function(globaleventsFactory) {

    var globaleventsLazyloadFactory = function () {
        this.globalevents = [];
        this.nextpage = 1;
        this.completelyLoaded = false;
        this.busyLoadingglobalevents = false;
        this.total = 0;
    };

    /* Create the function for the object (called prototyping in js) */
    globaleventsLazyloadFactory.prototype.loadMore = function () {
        /* If the list os already complete, no need to reload it */
        if(this.completelyLoaded) return;

        /* Do not call next page multiple times */
        if(this.busyLoadingGlobalevents) return;

        /* activate the business just before calling the service */
        this.busyLoadingGlobalevents = true;

        /* Get the employee list, page by page */
        globaleventsFactory.get({page:this.nextpage}, function(data){
            this.globalevents = this.globalevents.concat(data['globalevents']);

            /* update the current page */
            if(data['current_page'] < data['last_page']){
                this.nextpage =  data['current_page']+1;
            } else {
                this.completelyLoaded = true;
            }
            this.busyLoadingGlobalevents = false;

            /* to display the total */
            this.total = data['total'];

        }.bind(this)); /* bind is to associate the params to object properties, I guess...? */
    };

    return globaleventsLazyloadFactory;
}]);
