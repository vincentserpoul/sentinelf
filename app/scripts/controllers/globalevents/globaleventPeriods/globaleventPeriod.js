sentinelfApp.controller("GlobaleventPeriodCtrl", ['$scope', 'globaleventPeriodsFactory',
    function ($scope, globaleventPeriodsFactory) {

        $scope.deleteGlobaleventPeriod = function () {
            globaleventPeriodsFactory.delete({globaleventPeriodId:$scope.globalevent_period.id},
                function(data){
                    if(data && data['error'] == false){
                        /* Get the index of the targeted event */
                        var index = $scope.globaleventPeriodsLazyloadFactory.globalevent_periods.indexOf($scope.globalevent_period);
                        /* Destroy it */
                        $scope.globaleventPeriodsLazyloadFactory.globalevent_periods.splice(index, 1);
                    } else {
                        console.log(data['error']);
                    }
                }
            );
        }

        $scope.editGlobaleventPeriod = function () {
            $scope.globaleventPeriodTemplate = $scope.globaleventPeriodEditTemplate;
        }

        $scope.saveGlobaleventPeriod = function () {
                /* Launch service to create new db */
                globaleventPeriodsFactory.update({globaleventPeriodId:$scope.globalevent_period.id}, $scope.globalevent_period, function(data){
                    $scope.globaleventPeriodTemplate = $scope.globaleventPeriodViewTemplate;
                    angular.extend($scope.globalevent_period, data['globalevent_periods'][0]);
                });
        };

        $scope.cancelEditGlobaleventPeriod = function () {
            $scope.globaleventPeriodTemplate = $scope.globaleventPeriodViewTemplate;
        };

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
