'use strict';

sentinelfApp.factory('employeesFactory', ['$resource', function($resource) {

    return $resource('http://dev.sentinelb.com/api/v1/employee/:listFilter:employeeId/:listFilterParams/',
                    {
                        employeeId: "@employeeId",
                        listFilter: "@listFilter",
                        listFilterParams: "@listFilterParams",
                    },
                    {
                        "get": {method:"GET", cache: true},
                        "create": {method:"POST"},
                    	"update": {method:"PUT"},
        				"delete": {method:"DELETE"},
                        "search": {
                            method:"GET",
                            params: {
                                listFilter: "search",
                                listFilterParams: "@listFilterParams"
                            }
                        }
                	});
}]);

sentinelfApp.factory('employeesGlobaleventPeriodFactory', ['$resource', function($resource) {

    return $resource('http://dev.sentinelb.com/api/v1/employee/:employeeId/globalevent_period',
                    {employeeId: "@id"});
}]);

sentinelfApp.factory('employeesGlobaleventPeriodUnpaidFactory', ['$resource', function($resource) {

    return $resource('http://dev.sentinelb.com/api/v1/employee/:employeeId/unpaid_globalevent_period',
                    {employeeId: "@id"});
}]);

sentinelfApp.factory('employeesEventPeriodsFactory', ['$resource', function ($resource) {

    return $resource('http://dev.sentinelb.com/api/v1/employee/all_possible_globalevent_period/:event_id',
                    {event_id: "@id"});

}]);

sentinelfApp.factory('employeeEventPeriodsFactory', ['$resource', function ($resource) {

    return $resource('http://dev.sentinelb.com/api/v1/employee/:employee_id/possible_globalevent_period/:event_id',
                    {employee_id: "@id", event_id: "@id"});

}]);

sentinelfApp.factory('assignedEmployeesFactory', ['$resource', function ($resource) {

    return $resource('http://dev.sentinelb.com/api/v1/employee/assigned_employees/:globalevent_period_id',
                    {globalevent_period_id: "@id"});

}]);


/* Lazy loading of the employee list */
sentinelfApp.factory('employeesListProgressiveFactory', ['employeesFactory', function(employeesFactory) {

    var employeesListProgressiveFactory = function() {
        this.employees = [];
        this.nextpage = 1;
        this.completelyLoaded = false;
        this.busyLoadingEmployees = false;
    };

    employeesListProgressiveFactory.prototype.loadMore = function() {
        /* If the list os already complete, no need to reload it */
        if(this.completelyLoaded) return;

        /* Do not call next page multiple times */
        if(this.busyLoadingEmployees) return;

        /* activate the business just before calling the service */
        this.busyLoadingEmployees = true;

        /* Get the employee list, page by page */
        employeesFactory.get({page:this.nextpage}, function(data){
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
        }.bind(this));
    };

    return employeesListProgressiveFactory;
}]);
