'use strict';

sentinelfApp.controller("EvmployeeAssignedCtrl", ['$scope', '$filter', 'formService', 'AlertService', 'eventPeriodEmployeeFactory', 'assignedEmployeesFactory', 'employeesEventPeriodsFactory', function($scope, $filter, formService, AlertService, eventPeriodEmployeeFactory, assignedEmployeesFactory, employeesEventPeriodsFactory){

	$scope.unassign = function () {
        $scope.allSelected = false;
        $scope.onAllSelected();
        // Activate the edit
        $scope.unassignForm = true;
    }

    $scope.save = function () {
        // unassign selected employees
        var unassigned_employee_ids = new Array();
        for (var i in $scope.assignedEmployeesLazyloadFactory.assigned_employees) {
            if ($scope.assignedEmployeesLazyloadFactory.assigned_employees[i].isUnassigned) {
                var index = i;
                eventPeriodEmployeeFactory.delete({eventPeriodEmployeeId: 0, employee_id: $scope.assignedEmployeesLazyloadFactory.assigned_employees[i].id, event_period_id: $scope.eventPeriod.id}, function (data) {
                    unassigned_employee_ids.push(index);
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }, function (error) {
                    if (error['data'])
                        AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
                }).$promise.then(function () {
                    for (var j in unassigned_employee_ids) {
                        $scope.assignedEmployeesLazyloadFactory.assigned_employees.splice(unassigned_employee_ids[j] - j, 1);
                        $scope.assignedEmployeesLazyloadFactory.total--;
                    }
                });
            }
        }
    	$scope.unassignForm = false;
    }

    $scope.cancel = function () {
    	$scope.unassignForm = false;
    }

    $scope.onAllSelected = function () {
        for (var i in $scope.assignedEmployeesLazyloadFactory.assigned_employees) {
            $scope.assignedEmployeesLazyloadFactory.assigned_employees[i].isUnassigned = $scope.allSelected;
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
