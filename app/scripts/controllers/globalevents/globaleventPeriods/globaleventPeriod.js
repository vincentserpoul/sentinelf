sentinelfApp.controller("globaleventPeriodCtrl", ['$scope', function ($scope) {
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
