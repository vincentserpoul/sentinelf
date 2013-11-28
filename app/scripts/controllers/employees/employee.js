'use strict';

sentinelfApp.controller(
    'EmployeeCtrl', [
    '$scope', 'employeesGlobaleventFactory', function($scope, employeesGlobaleventFactory){

        init();

        function init(){

        }

        /* Display profile tab and hide the two others */
        $scope.showProfile = function(){
            $scope.displayProfile = !$scope.displayProfile;
            $scope.displayPayments=false;
            $scope.displayAssignments=false;
        }

        /* Display profile tab and hide the two others */
        $scope.showAssignments = function(){
            $scope.displayProfile=false;
            $scope.displayPayments=false;
            $scope.displayAssignments = !$scope.displayAssignments;
            if($scope.displayAssignments){
                employeesGlobaleventFactory.get({employeeId: 1}, function(data){
                    $scope.globaleventPeriods = data['globalevent_periods'];
                });
            }
        }

}])
