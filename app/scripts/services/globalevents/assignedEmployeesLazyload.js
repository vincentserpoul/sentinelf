'use strict';

/* Lazy loading of the employee list */
sentinelfApp.factory('assignedEmployeesLazyloadFactory', ['globaleventPeriodsFactory',
    function(globaleventPeriodsFactory) {

        var assignedEmployeesLazyloadFactory = function (globaleventPeriodId) {
            this.globaleventPeriodId = globaleventPeriodId;
            this.assignedEmployees = [];
            this.nextpage = 1;
            this.completelyLoaded = false;
            this.busyLoadingAssignedEmployees = false;
            this.total = 0;
        };

        /* Create the function for the object (called prototyping in js) */
        assignedEmployeesLazyloadFactory.prototype.loadMore = function () {
            /* If the list os already complete, no need to reload it */
            if(this.completelyLoaded){
                return;
            }

            /* Do not call next page multiple times */
            if(this.busyLoadingAssignedEmployees){
                return;
            }

            /* activate the business just before calling the service */
            this.busyLoadingAssignedEmployees = true;

            /* Get the employee list, page by page */
            globaleventPeriodsFactory.getAssignedEmployees({globaleventPeriodId: this.globaleventPeriodId, page:this.nextpage}, function(data){
                this.assignedEmployees = this.assignedEmployees.concat(data.employees);

                /* update the current page */
                if(data.current_page < data.last_page){
                    this.nextpage =  data.current_page+1;
                } else {
                    this.completelyLoaded = true;
                }
                this.busyLoadingAssignedEmployees = false;

                /* to display the total */
                this.total = data.total;

            }.bind(this)); /* bind is to associate the params to object properties, I guess...? */
        };

        return assignedEmployeesLazyloadFactory;
    }
]);
