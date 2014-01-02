'use strict';

/* Lazy loading of the employer list */
sentinelfApp.factory('employersLazyloadFactory', ['employersFactory', function(employersFactory) {

    var employersLazyloadFactory = function(searchCriterias) {
        this.employers = [];
        this.nextpage = 1;
        this.completelyLoaded = false;
        this.busyLoadingEmployers = false;
        this.total = null;
    };

    /* Create the function for the object (called prototyping in js) */
    employersLazyloadFactory.prototype.loadMore = function() {
        /* If the list os already complete, no need to reload it */
        if(this.completelyLoaded) return;

        /* Do not call next page multiple times */
        if(this.busyLoadingEmployers) return;

        /* activate the business just before calling the service */
        this.busyLoadingEmployers = true;

        /* Get the employer list, page by page */
        employersFactory.get({page:this.nextpage}, function(data){
            /* Push each employer in the main list */
            angular.forEach(data['employers'], function(employer){
                this.push(employer);
            }, this.employers);


            /* update the current page */
            if(data['current_page'] < data['last_page']){
                this.nextpage =  data['current_page']+1;
            } else {
                this.completelyLoaded = true;
            }
            this.busyLoadingEmployers = false;

            /* to display the total */
            this.total = data['total'];

        }.bind(this)); /* bind is to associate the params to object properties, I guess...? */
    };

    return employersLazyloadFactory;
}]);
