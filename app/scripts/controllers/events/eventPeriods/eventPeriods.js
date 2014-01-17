'use strict';

sentinelfApp.controller("EventPeriodsCtrl", ['$scope', 'crud', 'formService', 'AlertService', 'eventPeriodFactory', 'employeesEventPeriodsFactory',  function ($scope, crud, formService, AlertService, eventPeriodFactory, employeesEventPeriodsFactory) {
    var obj = "eventPeriod";
    var preselectedValues = {
        "event_id": $scope.event.id,
        "start_datetime": "2013-01-01 00:00:00",
        "end_datetime": "2013-01-01 00:00:10",
        "number_of_employee_needed": 1};
    $scope.showNew = false;
    $scope.viewTemplate = "views/events/eventPeriods/eventPeriodView.html";
    $scope.editTemplate = "views/events/eventPeriods/eventPeriodEdit.html";
    $scope.eventPeriodTemplate = $scope.viewTemplate;

    $scope.newEventPeriod = function () {
        crud.new($scope, obj, preselectedValues);
    }

    $scope.saveNewEventPeriod = function () {
        crud.create($scope, obj);
    }

    $scope.cancelNewEventPeriod = function () {
        crud.cancelNew($scope);
    }
}])

sentinelfApp.controller("EventPeriodCtrl", ['$scope', 'crud', 'assignedEmployeesLazyloadFactory', function ($scope, crud, assignedEmployeesLazyloadFactory) {
    var obj = 'eventPeriod';

    $scope.editEventPeriod = function () {
        crud.edit($scope, obj);
    }

    $scope.saveEventPeriod = function () {
        crud.save($scope, obj);
    };

    $scope.cancelEditEventPeriod = function () {
        crud.cancelEdit($scope, obj);
    };

    /* Delete employee button for each employee */
    $scope.deleteEventPeriod = function () {
        crud.delete($scope, obj, 'id');
    }

    // load assigned employees for event period
    $scope.loadAssignments = function () {
        if (!$scope.assignedEmployeesLazyloadFactory) {
            /* Load the progressive service to load list of employees */
            $scope.assignedEmployeesLazyloadFactory = new assignedEmployeesLazyloadFactory($scope.eventPeriod.id);
            /* First launch */
            $scope.assignedEmployeesLazyloadFactory.loadMore();    
        }
        $scope.showAssignments = !$scope.showAssignments;
    }

    $scope.$on('updateAssignments', function (event, newEmployee) {
        if ($scope.assignedEmployeesLazyloadFactory) {
            //push new employee
            $scope.assignedEmployeesLazyloadFactory.assigned_employees.unshift(newEmployee);
            $scope.assignedEmployeesLazyloadFactory.total++;
        }
    })
}]);
