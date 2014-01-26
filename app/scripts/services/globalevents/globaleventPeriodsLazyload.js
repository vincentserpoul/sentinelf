'use strict';

/* Lazy loading of the employee list */
sentinelfApp.factory('globaleventPeriodsLazyloadFactory', ['globaleventPeriodsFactory', function(globaleventPeriodsFactory) {

    var globaleventPeriodsLazyloadFactory = function (globalevent_id) {
        this.globalevent_id = globalevent_id;
        this.globaleventPeriods = [];
        this.nextpage = 1;
        this.completelyLoaded = false;
        this.busyLoadingGlobaleventPeriods = false;
        this.total = 0;
    };

    /* Create the function for the object (called prototyping in js) */
    globaleventPeriodsLazyloadFactory.prototype.loadMore = function () {
        /* If the list os already complete, no need to reload it */
        if(this.completelyLoaded) return;

        /* Do not call next page multiple times */
        if(this.busyLoadingGlobaleventPeriods) return;

        /* activate the business just before calling the service */
        this.busyLoadingGlobaleventPeriods = true;

        /* Get the employee list, page by page */
        globaleventPeriodsFactory.get({globalevent_id: this.globalevent_id, page:this.nextpage}, function(data){
            this.globaleventPeriods = this.globaleventPeriods.concat(data['globaleventPeriods']);

            /* update the current page */
            if(data['current_page'] < data['last_page']){
                this.nextpage =  data['current_page']+1;
            } else {
                this.completelyLoaded = true;
            }
            this.busyLoadingGlobaleventPeriods = false;

            /* to display the total */
            this.total = data['total'];

        }.bind(this)); /* bind is to associate the params to object properties, I guess...? */
    };

    return globaleventPeriodsLazyloadFactory;
}]);
