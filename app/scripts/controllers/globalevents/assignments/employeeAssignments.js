'use strict';

sentinelfApp.controller('EmployeeAssignmentsCtrl',
    ['$scope', 'globaleventPeriodEmployeesFactory', 'AlertService',
    function ($scope, globaleventPeriodEmployeesFactory, AlertService) {

    $scope.assign = function (globaleventPeriodId) {

        globaleventPeriodEmployeesFactory.save({'globaleventPeriodId': globaleventPeriodId, 'employeeId': $scope.employee.id},
            function (data) {
                if (data) {
                    $scope.employee[globaleventPeriodId] = globaleventPeriodId;
                    AlertService.show({ 'message': data.message, 'type': 'alert-success' }, true);
                }
            }, function (error) {
                if (error.data){
                    AlertService.show({ 'message': error.data.message, 'type': 'alert-danger' }, false);
                }
            }
        );
    };
}]);
