'use strict';

sentinelfApp.controller('EmployeeEventAssignmentCtrl', ['$scope', '$filter', 'formService', 'employeesFactory', 'eventPeriodEmployeeFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', 'AlertService', 'employeesEventPeriodsFactory', 'assignedEmployeesFactory', 'wholeEventFactory', function($scope, $filter, formService, employeesFactory, eventPeriodEmployeeFactory, modelStaticLabelsFactory, modelIsoLabelsFactory, AlertService, employeesEventPeriodsFactory, assignedEmployeesFactory, wholeEventFactory){

    /*
    init();

    function init () {
        console.log('init');
        $scope.employee_possible_event_periods = $filter('filter_event_periods')($scope.eventsPeriods, {'globalevent_id':$scope.event.id, 'employee_id': $scope.employee.id, 'all_possible_globalevent_periods': $scope.all_possible_globalevent_periods});
    }
    */

	$scope.assign = function (globalevent_period_id) {
		eventPeriodEmployeeFactory.save({'globalevent_period_id': globalevent_period_id, 'employee_id': $scope.employee.id},
            function (data) {
                if (data) {
                    // push new global event employee
                    $scope.eventPeriodEmployees.push(data['globalevent_period_employees']);
                    // update possible event periods
                    employeesEventPeriodsFactory.get({'event_id': 0}, function (data) {
                        $scope.setAllPossibleGlobaleventPeriods(data['possible_globalevent_periods']);
                    })

                    // update data
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