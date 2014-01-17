'use strict';

/* Lazy loading of the department list */
sentinelfApp.factory('departmentsLazyloadFactory', ['departmentsFactory', function(departmentsFactory) {

    var departmentsLazyloadFactory = function(client_id) {
        this.departments = [];
        this.client_id = client_id;
        this.nextpage = 1;
        this.completelyLoaded = false;
        this.busyLoadingDepartments = false;
        this.total = null;
    };

    /* Create the function for the object (called prototyping in js) */
    departmentsLazyloadFactory.prototype.loadMore = function() {
        /* If the list os already complete, no need to reload it */
        if(this.completelyLoaded) return;

        /* Do not call next page multiple times */
        if(this.busyLoadingDepartments) return;

        /* activate the business just before calling the service */
        this.busyLoadingDepartments = true;

        /* Get the department list, page by page */
        departmentsFactory.get({client_id: this.client_id, page:this.nextpage}, function(data){
            /* Push each department in the main list */
            angular.forEach(data['ClientDepartments'], function(department){
                this.push(department);
            }, this.departments);


            /* update the current page */
            if(data['current_page'] < data['last_page']){
                this.nextpage =  data['current_page']+1;
            } else {
                this.completelyLoaded = true;
            }
            this.busyLoadingDepartments = false;

            /* to display the total */
            this.total = data['total'];

        }.bind(this)); /* bind is to associate the params to object properties, I guess...? */
    };

    return departmentsLazyloadFactory;
}]);
