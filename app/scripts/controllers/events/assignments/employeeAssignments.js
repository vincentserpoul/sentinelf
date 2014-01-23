'use strict';

sentinelfApp.controller('EmployeeAssignmentsCtrl',
    ['$scope', 'eventPeriodEmployeeFactory', 'AlertService',
    function ($scope, eventPeriodEmployeeFactory, AlertService) {

    $scope.assign = function (globalevent_period_id) {

        eventPeriodEmployeeFactory.save({'globalevent_period_id': globalevent_period_id, 'employee_id': $scope.employee.id},
            function (data) {
               if (data) {
                    $scope.employee[globalevent_period_id] = globalevent_period_id;
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }
            }, function (error) {
                if (error['data']){
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
                }
            }
        )

    };

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
