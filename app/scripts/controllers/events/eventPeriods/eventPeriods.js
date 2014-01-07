'use strict';

sentinelfApp.controller("EventPeriodsCtrl", ['$scope', 'formService', 'AlertService', 'eventPeriodFactory', 'employeesEventPeriodsFactory',  function ($scope, formService, AlertService, eventPeriodFactory, employeesEventPeriodsFactory) {
    $scope.newEventPeriod = function () {
        // preselected values for new employer
        $scope.createdEventPeriod = {
            "event_id": $scope.event.id,
            "start_datetime": "2013-01-01 00:00:00",
            "end_datetime": "2013-01-01 00:00:10",
            "number_of_employee_needed": 1};
        $('#collapseNewEventPeriod' + $scope.event.id).collapse('show');
    }

    $scope.saveNewEventPeriod = function () {
        eventPeriodFactory.save($scope.createdEventPeriod,
            function (data) {
                if (data) {
                    $scope.eventPeriodsLazyloadFactory.eventPeriods.unshift(data['GlobaleventPeriod']);
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }
            }, function (error) {
                if (error['data'])
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
            }
        );
        $('#collapseNewEventPeriod' + $scope.event.id).collapse('hide');
    }

    $scope.cancelNewEventPeriod = function () {
        $('#collapseNewEventPeriod' + $scope.event.id).collapse('hide');   
    }
}])

sentinelfApp.controller("EventPeriodCtrl", ['$scope', 'formService', 'AlertService', 'eventFactory', 'eventPeriodFactory', 'assignedEmployeesLazyloadFactory', 'employeesEventPeriodsFactory', function ($scope, formService, AlertService, eventFactory, eventPeriodFactory, assignedEmployeesLazyloadFactory, employeesEventPeriodsFactory) {

    $scope.editForm = false;

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
        formService.copyProps($scope.savEventPeriod, $scope.eventPeriod);
        // Deactivate the edit
        $scope.editForm = false;
    };

    /* Delete employee button for each employee */
    $scope.deleteEventPeriod = function () {

        var modalInstance = formService.popup('period', "from " + $scope.eventPeriod.start_datetime + " to " + $scope.eventPeriod.end_datetime);

        modalInstance.result.then(function(){
            eventPeriodFactory.delete({eventPeriodId:$scope.eventPeriod.id},
                function (data) {
                    $scope.eventPeriodsLazyloadFactory.eventPeriods.splice(formService.findInArray($scope.eventPeriodsLazyloadFactory.eventPeriods, $scope.eventPeriod.id), 1);
                    if (data)
                        AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }, function (error) {
                    if (error['data'])
                        AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
                }
            );
        });
    }

    // load assigned employees for event period
    $scope.loadAssignments = function () {
        if (!$scope.assignedEmployeesLazyloadFactory) {
            /* Load the progressive service to load list of employees */
            $scope.assignedEmployeesLazyloadFactory = new assignedEmployeesLazyloadFactory($scope.eventPeriod.id);
            /* First launch */
            $scope.assignedEmployeesLazyloadFactory.loadMore();    
        }
    }

    $scope.$on('updateAssignments', function (event, newEmployee) {
        if ($scope.assignedEmployeesLazyloadFactory) {
            //push new employee
            $scope.assignedEmployeesLazyloadFactory.assigned_employees.unshift(newEmployee);
            $scope.assignedEmployeesLazyloadFactory.total++;
        }
    })
}]);
