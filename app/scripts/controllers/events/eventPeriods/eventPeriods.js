'use strict';

sentinelfApp.controller("EventPeriodCtrl", ['$scope', 'formService', 'AlertService', 'eventsFactory', 'eventPeriodFactory', function ($scope, formService, AlertService, eventsFactory, eventPeriodFactory) {

    $scope.editEventPeriod = function () {
        // Save eventPeriod in case of cancel, to rollback to previous values
        $scope.savEventPeriod = angular.copy($scope.eventPeriod);
        // Activate the edit
        $scope.editForm = true;
    }

    $scope.saveEventPeriod = function () {
        // format datetime
        console.log($scope.eventPeriod);
        if ($scope.eventPeriod.start_datetime instanceof Date) {
            $scope.eventPeriod.start_datetime = "" + $scope.eventPeriod.start_datetime.getFullYear() + "-" + $scope.eventPeriod.start_datetime.getMonth().toPrecision(2) + "-" + $scope.eventPeriod.start_datetime.getDate().toPrecision(2) + " " + $scope.eventPeriod.start_datetime.getHours().toPrecision(2) + ":" + $scope.eventPeriod.start_datetime.getMinutes().toPrecision(2) + ":00";   
        } else if ($scope.eventPeriod.end_datetime instanceof Date) {
            $scope.eventPeriod.end_datetime = "" + $scope.eventPeriod.end_datetime.getFullYear() + "-" + $scope.eventPeriod.end_datetime.getMonth().toPrecision(2) + "-" + $scope.eventPeriod.end_datetime.getDate().toPrecision(2) + " " + $scope.eventPeriod.end_datetime.getHours().toPrecision(2) + ":" + $scope.eventPeriod.end_datetime.getMinutes().toPrecision(2) + ":00";
        }
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
            eventPeriodsFactory.delete({eventPeriodId:$scope.eventPeriod.id},
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

}]);
