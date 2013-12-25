'use strict';

sentinelfApp.controller("EventPeriodsAssignmentsCtrl", ['$scope', '$filter', 'formService', 'AlertService', 'eventPeriodEmployeeFactory', 'assignedEmployeesFactory', 'employeesEventPeriodsFactory', function($scope, $filter, formService, AlertService, eventPeriodEmployeeFactory, assignedEmployeesFactory, employeesEventPeriodsFactory){

	$scope.unassign = function () {
        $scope.allSelected = false;
        $scope.onAllSelected();
        // Activate the edit
        $scope.unassignForm = true;
    }

    $scope.save = function () {
        // unassign selected employees
        var event_period_employees = $scope.eventPeriodEmployees.filter(function (value, index) {return value['globalevent_period_id'] == $scope.eventPeriod.id});
        for (var i in event_period_employees) {
            if (event_period_employees[i].isUnassigned) {
                eventPeriodEmployeeFactory.delete({eventPeriodEmployeeId: event_period_employees[i]['id']}, function (data) {
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }, function (error) {
                    if (error['data'])
                        AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
                }).$promise.then(function () {
                    eventPeriodEmployeeFactory.get(function (data) {
                        $scope.setEventPeriodEmployees(data['GlobaleventPeriodEmployees']);
                    })
                    // update possible event periods
                    employeesEventPeriodsFactory.get({'event_id': 0}, function (data) {
                        $scope.setAllPossibleGlobaleventPeriods(data['possible_globalevent_periods']);
                    })
                }); 
            }
        }
    	$scope.unassignForm = false;
    }

    $scope.cancel = function () {
    	$scope.unassignForm = false;
    }

    $scope.onAllSelected = function () {
        for (var i in $scope.eventPeriodEmployees) {
            if ($scope.eventPeriodEmployees[i]['globalevent_period_id'] == $scope.eventPeriod.id)
                $scope.eventPeriodEmployees[i].isUnassigned = $scope.allSelected;
        }
    }

}]);

sentinelfApp.filter('filter_assigned_employees', function () {
    return function (input, parameters) {
        if (input && parameters['globalevent_period_employees']) {
            var globalevent_period_assignments = parameters['globalevent_period_employees'].filter( function (value, index) {return value['globalevent_period_id'] == parameters['globalevent_period_id']});
            var employees = new Array();
            for (var i = 0; i < globalevent_period_assignments.length; i++) {
                employees.push(input.filter( function (value, index) {return value['id'] == globalevent_period_assignments[i]['employee_id']})[0]);
            }
            return employees;
        }
    }
})

sentinelfApp.filter('filter_event_period_employee', ['formService', function (formService) {
    return function (input, parameters) {
        if (input) {
            return formService.findObjectByIdWithIdRefs(input, {'globalevent_period_id': parameters['globalevent_period_id'], 'employee_id': parameters['employee_id']});
        }
    }
}])