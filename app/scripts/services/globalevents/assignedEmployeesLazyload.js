'use strict';

/* Lazy loading of the employee list */
sentinelfApp.factory('assignedEmployeesLazyloadFactory', ['assignedEmployeesFactory', function(assignedEmployeesFactory) {

    var assignedEmployeesLazyloadFactory = function (globaleventperiod_id) {
        this.globaleventperiod_id = globaleventperiod_id;
        this.assigned_employees = [];
        this.nextpage = 1;
        this.completelyLoaded = false;
        this.busyLoadingAssignedEmployees = false;
        this.total = 0;
    };

    /* Create the function for the object (called prototyping in js) */
    assignedEmployeesLazyloadFactory.prototype.loadMore = function () {
        /* If the list os already complete, no need to reload it */
        if(this.completelyLoaded) return;

        /* Do not call next page multiple times */
        if(this.busyLoadingAssignedEmployees) return;

        /* activate the business just before calling the service */
        this.busyLoadingAssignedEmployees = true;

        /* Get the employee list, page by page */
        assignedEmployeesFactory.get({globaleventperiod_id: this.globaleventperiod_id, page:this.nextpage}, function(data){
            this.assigned_employees = this.assigned_employees.concat(data['employees']);

            /* update the current page */
            if(data['current_page'] < data['last_page']){
                this.nextpage =  data['current_page']+1;
            } else {
                this.completelyLoaded = true;
            }
            this.busyLoadingAssignedEmployees = false;

            /* to display the total */
            this.total = data['total'];

        }.bind(this)); /* bind is to associate the params to object properties, I guess...? */
    };

    return assignedEmployeesLazyloadFactory;
}]);
