'use strict';

sentinelfApp.controller('EventsAssignmentsCtrl', ['$scope', 'formService', 'employeesFactory', 'eventPeriodEmployeeFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', 'AlertService', 'employeeEventPeriodsFactory', 'assignedEmployeesFactory', function($scope, formService, employeesFactory, eventPeriodEmployeeFactory, modelStaticLabelsFactory, modelIsoLabelsFactory, AlertService, employeeEventPeriodsFactory, assignedEmployeesFactory){

	$scope.assign = function (globalevent_period_id, employee_id) {
		eventPeriodEmployeeFactory.save({'globalevent_period_id': globalevent_period_id, 'employee_id': employee_id},
            function (data) {
                if (data) {
                    formService.findObjectById($scope.employees, employee_id)['possible_globalevent_periods'] = data['possible_globalevent_period'];
                    var globalevent_period = formService.findObjectById($scope.eventsPeriods, globalevent_period_id);
                    if (globalevent_period['assigned_employees']) {
                        assignedEmployeesFactory.get({'globalevent_period_id': globalevent_period_id}, function (data) {
                            globalevent_period['assigned_employees'] = data['Employees'];
                        })
                    }
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }
            }, function (error) {
                if (error['data'])
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
            }
        );
	}
}])