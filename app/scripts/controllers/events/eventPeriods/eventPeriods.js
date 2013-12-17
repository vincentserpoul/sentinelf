'use strict';

sentinelfApp.controller("EventPeriodCtrl", ['$scope', 'formService', 'AlertService', 'eventsFactory', 'eventPeriodFactory', 'assignedEmployeesFactory', function ($scope, formService, AlertService, eventsFactory, eventPeriodFactory, assignedEmployeesFactory) {

    $scope.editEventPeriod = function () {
        // Save eventPeriod in case of cancel, to rollback to previous values
        $scope.savEventPeriod = angular.copy($scope.eventPeriod);
        // Activate the edit
        $scope.editForm = true;
    }

    $scope.saveEventPeriod = function () {
        /* Call the factory to update the new eventPeriod in db */
        eventPeriodFactory.update($scope.eventPeriod,
            function (data) {
                if (data) {
                    // when success, reset the savEventPeriod
                    $scope.savEventPeriod = null;
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }
            }, function (error) {
                if (error['data'])
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
            }
        );
        $scope.editForm = false;
    };

    $scope.cancelEditEventPeriod = function () {
        // Reset the data to what it was before the edit
        $scope.eventPeriod = $scope.savEventPeriod;
        // Deactivate the edit
        $scope.editForm = false;
    };

    /* Delete employee button for each employee */
    $scope.deleteEventPeriod = function () {

        var modalInstance = formService.popup('eventPeriod', $scope.eventPeriod.name);

        modalInstance.result.then(function(){
            eventPeriodFactory.delete({eventPeriodId:$scope.eventPeriod.id},
                function (data) {
                    $scope.eventPeriods.splice(formService.findInArray($scope.eventPeriods, $scope.eventPeriod.id), 1);
                    if (data)
                        AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }, function (error) {
                    if (error['data'])
                        AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
                }
            );
        });
    }

    $scope.loadAssignedEmployees = function () {

        if (!$scope.eventPeriod['assigned_employees']) {
            assignedEmployeesFactory.get({'globalevent_period_id': $scope.eventPeriod.id}, function (data) {
                $scope.eventPeriod['assigned_employees'] = data['Employees'];
            })
        }

    }

}]);
