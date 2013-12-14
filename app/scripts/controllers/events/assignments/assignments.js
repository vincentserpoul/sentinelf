'use strict';

sentinelfApp.controller('EventsAssignmentsCtrl', ['$scope', 'employeesFactory', 'eventPeriodEmployeeFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', 'AlertService', function($scope, employeesFactory, eventPeriodEmployeeFactory, modelStaticLabelsFactory, modelIsoLabelsFactory, AlertService){

	$scope.assign = function (globalevent_period_id, employee_id) {
		eventPeriodEmployeeFactory.save({'globalevent_period_id': globalevent_period_id, 'employee_id': employee_id},
            function (data) {
                if (data) {
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }
            }, function (error) {
                if (error['data'])
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
            }
        );
	}
}])