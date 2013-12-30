'use strict';

/* Lazy loading of the employee list */
sentinelfApp.factory('employeesSearchLazyloadFactory', ['employeesFactory', function(employeesFactory) {

    var employeesSearchLazyloadFactory = function(searchCriterias) {
        this.employees = [];
        this.nextpage = 1;
        this.completelyLoaded = false;
        this.busyLoadingEmployees = false;
        this.searchCriterias = searchCriterias;
        this.total = null;
    };

    /* Create the function for the object (called prototyping in js) */
    employeesSearchLazyloadFactory.prototype.loadMore = function() {
        /* If the list os already complete, no need to reload it */
        if(this.completelyLoaded) return;

        /* Do not call next page multiple times */
        if(this.busyLoadingEmployees) return;

        /* activate the business just before calling the service */
        this.busyLoadingEmployees = true;

        /* Get the employee list, page by page */
        employeesFactory.search({listFilterParams: angular.toJson(this.searchCriterias), page:this.nextpage}, function(data){
            /* Push each employee in the main list */
            angular.forEach(data['employees'], function(employee){
                this.push(employee);
            }, this.employees);


            /* update the current page */
            if(data['current_page'] < data['last_page']){
                this.nextpage =  data['current_page']+1;
            } else {
                this.completelyLoaded = true;
            }
            this.busyLoadingEmployees = false;

            /* to display the total */
            this.total = data['total'];

        }.bind(this)); /* bind is to associate the params to object properties, I guess...? */
    };

    return employeesSearchLazyloadFactory;
}]);
