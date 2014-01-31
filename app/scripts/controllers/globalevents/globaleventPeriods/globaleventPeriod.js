'use strict';

sentinelfApp.controller('GlobaleventPeriodCtrl', ['$scope', 'globaleventPeriodsFactory', 'assignedEmployeesLazyloadFactory', 'globaleventPeriodEmployeesFactory',
    function ($scope, globaleventPeriodsFactory, assignedEmployeesLazyloadFactory, globaleventPeriodEmployeesFactory) {

        $scope.deleteGlobaleventPeriod = function () {
            globaleventPeriodsFactory.delete({globaleventPeriodId:$scope.globalevent_period.id},
                function(data){
                    if(data && data.error === false){
                        /* Get the index of the targeted event */
                        var index = $scope.globaleventPeriodsLazyloadFactory.globalevent_periods.indexOf($scope.globalevent_period);
                        /* Destroy it */
                        $scope.globaleventPeriodsLazyloadFactory.globalevent_periods.splice(index, 1);
                    } else {
                        console.log(data.error);
                    }
                }
            );
        };

        $scope.editGlobaleventPeriod = function () {
            $scope.globaleventPeriodTemplate = $scope.globaleventPeriodEditTemplate;
        };

        $scope.saveGlobaleventPeriod = function () {
            /* Launch service to create new db */
            globaleventPeriodsFactory.update({globaleventPeriodId:$scope.globalevent_period.id}, $scope.globalevent_period, function(data){
                $scope.globaleventPeriodTemplate = $scope.globaleventPeriodViewTemplate;
                angular.extend($scope.globalevent_period, data.globalevent_periods[0]);
            });
        };

        $scope.cancelEditGlobaleventPeriod = function () {
            $scope.globaleventPeriodTemplate = $scope.globaleventPeriodViewTemplate;
        };

        // load assigned employees for globalevent period
        $scope.loadAssignedEmployees = function () {
            $scope.showAssignments = !$scope.showAssignments;
            if ($scope.showAssignments === true) {
                /* Load the progressive service to load list of employees */
                $scope.assignedEmployeesLazyloadFactory = new assignedEmployeesLazyloadFactory($scope.globalevent_period.id);
                /* First launch */
                $scope.assignedEmployeesLazyloadFactory.loadMore();
            }
        };
    }
]);


sentinelfApp.controller('GlobaleventPeriodEmployeeCtrl', ['$scope', 'globaleventPeriodEmployeesFactory',
    function ($scope, globaleventPeriodEmployeesFactory) {

        // unassign employee
        $scope.unassignEmployee = function () {
            globaleventPeriodEmployeesFactory.delete({globaleventPeriodEmployeeId:$scope.assignedEmployee.globalevent_period_employee_id},
                function(data){
                    if(data && data.error === false){
                        /* Get the index of the targeted event */
                        var index = $scope.assignedEmployeesLazyloadFactory.assignedEmployees.indexOf($scope.assignedEmployee);

                        console.log(index);
                        /* Destroy it */
                        $scope.assignedEmployeesLazyloadFactory.assignedEmployees.splice(index, 1);
                        /* Counter -1 */
                        $scope.assignedEmployeesLazyloadFactory.total -= 1;
                    } else {
                        console.log(data.error);
                    }

                }
            );
        };
    }
]);
