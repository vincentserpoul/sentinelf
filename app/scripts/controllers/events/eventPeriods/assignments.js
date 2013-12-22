'use strict';

sentinelfApp.controller("EventPeriodsAssignmentsCtrl", ['$scope', 'formService', 'AlertService', 'eventPeriodEmployeeFactory', 'assignedEmployeesFactory', function($scope, formService, AlertService, eventPeriodEmployeeFactory, assignedEmployeesFactory){

	$scope.unassign = function () {
        // Save event in case of cancel, to rollback to previous values
        $scope.savEventPeriodEmployee = angular.copy($scope.eventsPeriods.eventperiodemployee);
        // Activate the edit
        $scope.unassignForm = true;
    }

    $scope.save = function () {
        // unassign selected employees
        for (var i = 0; i < $scope.eventPeriod.assigned_employees.length; i++) {
            if ($scope.eventPeriod.assigned_employees[i].isUnassigned) {
                eventPeriodEmployeeFactory.delete({'eventPeriodEmployeeId': $scope.eventPeriod.assigned_employees[i].globalevent_period_employee_id}, function (data) {
                    formService.findObjectById($scope.employees, data['employee_id'])['possible_globalevent_periods'] = data['possible_globalevent_period'];
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }, function (error) {
                    if (error['data'])
                        AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
                }).$promise.then(function () {
                    assignedEmployeesFactory.get({'globalevent_period_id': $scope.eventPeriod.id}, function (data) {
                        $scope.eventPeriod['assigned_employees'] = data['Employees'];
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
        for (var i = 0; i < $scope.eventPeriod.assigned_employees.length; i++) {
            $scope.eventPeriod.assigned_employees[i].isUnassigned = $scope.allSelected;
        }
    }

}]);
