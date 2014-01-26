'use strict';

sentinelfApp.controller("GlobaleventPeriodsCtrl", ['$scope', 'crud', 'formService', 'AlertService', 'globaleventPeriodFactory', 'employeesglobaleventPeriodsFactory',  function ($scope, crud, formService, AlertService, globaleventPeriodFactory, employeesglobaleventPeriodsFactory) {
    var obj = "globaleventPeriod";
    var preselectedValues = {
        "globalevent_id": $scope.globalevent.id,
        "start_datetime": "2013-01-01 00:00:00",
        "end_datetime": "2013-01-01 00:00:10",
        "number_of_employee_needed": 1};
    $scope.showNew = false;
    $scope.viewTemplate = "views/globalevents/globaleventPeriods/globaleventPeriodView.html";
    $scope.editTemplate = "views/globalevents/globaleventPeriods/globaleventPeriodEdit.html";
    $scope.globaleventPeriodTemplate = $scope.viewTemplate;

    $scope.newGlobaleventPeriod = function () {
        crud.new($scope, obj, preselectedValues);
    }

    $scope.saveNewGlobaleventPeriod = function () {
        crud.create($scope, obj);
    }

    $scope.cancelNewGlobaleventPeriod = function () {
        crud.cancelNew($scope);
    }
}])

sentinelfApp.controller("globaleventPeriodCtrl", ['$scope', 'crud', 'assignedEmployeesLazyloadFactory', function ($scope, crud, assignedEmployeesLazyloadFactory) {
    var obj = 'globaleventPeriod';

    $scope.editGlobaleventPeriod = function () {
        crud.edit($scope, obj);
    }

    $scope.saveGlobaleventPeriod = function () {
        crud.save($scope, obj);
    };

    $scope.cancelEditGlobaleventPeriod = function () {
        crud.cancelEdit($scope, obj);
    };

    /* Delete employee button for each employee */
    $scope.deleteGlobaleventPeriod = function () {
        crud.delete($scope, obj, 'id');
    }

    // load assigned employees for globalevent period
    $scope.loadAssignments = function () {
        if (!$scope.assignedEmployeesLazyloadFactory) {
            /* Load the progressive service to load list of employees */
            $scope.assignedEmployeesLazyloadFactory = new assignedEmployeesLazyloadFactory($scope.globaleventPeriod.id);
            /* First launch */
            $scope.assignedEmployeesLazyloadFactory.loadMore();
        }
        $scope.showAssignments = !$scope.showAssignments;
    }

    $scope.$on('updateAssignments', function (globalevent, newEmployee) {
        if ($scope.assignedEmployeesLazyloadFactory) {
            //push new employee
            $scope.assignedEmployeesLazyloadFactory.assigned_employees.unshift(newEmployee);
            $scope.assignedEmployeesLazyloadFactory.total++;
        }
    })
}]);
