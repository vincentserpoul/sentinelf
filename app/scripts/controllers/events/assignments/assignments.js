'use strict';

sentinelfApp.controller('EmployeeEventAssignmentsCtrl', ['$scope', '$modalInstance', 'employeesSearchLazyloadFactory', 'globalevent_id', 'label', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', function ($scope, $modalInstance, employeesSearchLazyloadFactory, globalevent_id, label, modelStaticLabelsFactory, modelIsoLabelsFactory) {
    init();

    /* Regroup init of the page in one single function */
    function init() {
        $scope.label = label;
        $scope.globalevent_id = globalevent_id;

        /* Get the labels necessary for the list not to be only numbers */
        $scope.staticLabelListResource = modelStaticLabelsFactory.get({model:'employee'});

        /* For access in the list directly */
        $scope.staticLabelListResource.$promise.then(function(data){
            $scope.employeeStaticLabels = data['labels'];
        });

        /* Get the labels necessary for the list of countries not to be only codes */
        $scope.countryListResource = modelIsoLabelsFactory.get({model:'country'});
    }

    $scope.searchEmployees = function (){
        this.searchCriterias['globalevent_id'] = globalevent_id;
        /* Load the progressive service to load list of employees */
        $scope.employeesSearchLazyloadFactory = new employeesSearchLazyloadFactory(this.searchCriterias);
        /* First launch */
        $scope.employeesSearchLazyloadFactory.loadMore();
        /* display the search results */
        $scope.displayList = true;
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
}])

sentinelfApp.controller('EmployeeEventAssignmentCtrl', ['$rootScope', '$scope', '$filter', 'formService', 'employeesFactory', 'eventPeriodEmployeeFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', 'AlertService', 'employeesEventPeriodsFactory', 'assignedEmployeesFactory', 'wholeEventFactory', 'employeeEventPeriodsFactory', function($rootScope, $scope, $filter, formService, employeesFactory, eventPeriodEmployeeFactory, modelStaticLabelsFactory, modelIsoLabelsFactory, AlertService, employeesEventPeriodsFactory, assignedEmployeesFactory, wholeEventFactory, employeeEventPeriodsFactory){

	$scope.assign = function (globalevent_period_id) {
		eventPeriodEmployeeFactory.save({'globalevent_period_id': globalevent_period_id, 'employee_id': $scope.employee.id},
            function (data) {
                if (data) {
                    // update data
                    employeeEventPeriodsFactory.get({employee_id: $scope.employee.id, event_id: $scope.globalevent_id}, function (data) {
                        $scope.employee.possible_globalevent_periods = data['globalevent_periods'];
                    })
                    // if event periods of the event are loaded then update assigned employees of the event period
                    $rootScope.$broadcast('updateAssignments', {'id': $scope.employee.id, 
                                                                'first_name': $scope.employee.first_name, 
                                                                'last_name': $scope.employee.last_name, 
                                                                'globalevent_period_employee_id': data['globalevent_period_employees']['id']});
                    //init();
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }
            }, function (error) {
                if (error['data'])
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
            }
        );
	}

    $scope.assign_whole_event = function () {
        wholeEventFactory.save({'globalevent_id': $scope.event.id, 'employee_id': $scope.employee.id}, 
            function (data) {
                if (data) {
                    for (var i in data['globalevent_period_employees'])
                        $scope.eventPeriodEmployees.push(data['globalevent_period_employees'][i]);
                    employeesEventPeriodsFactory.get({'event_id': 0}, function (data) {
                        $scope.all_possible_globalevent_periods = data['possible_globalevent_periods'];
                    })
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }
            }, function (error) {
                if (error['data']) {
                    for (var i in error['data']['globalevent_period_employees'])
                        $scope.eventPeriodEmployees.push(error['data']['globalevent_period_employees'][i]);
                    employeesEventPeriodsFactory.get({'event_id': 0}, function (data) {
                        $scope.all_possible_globalevent_periods = data['possible_globalevent_periods'];
                    })
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
                }
            }
        )
    }
}])

sentinelfApp.filter('filter_event_periods', function () {
    return function (input, parameters) {
        if (input && parameters['all_possible_globalevent_periods']) {
            var employee_possible_event_periods = parameters['all_possible_globalevent_periods'].filter( function (value, index) {return value['employee_id'] == parameters['employee_id']});
            var filtered_event_periods = input.filter( function (value, index) {return value['globalevent_id'] == parameters['globalevent_id']});
            for (var i = 0; i < filtered_event_periods.length; i++) {
                if (!employee_possible_event_periods.filter( function (value, index) {return value['globalevent_period_id'] == filtered_event_periods[i].id && value['employee_id'] == parameters['employee_id']}).length) {
                    filtered_event_periods.splice(i, 1);
                    i--;
                }
            }
            return filtered_event_periods;
        }
    }
})