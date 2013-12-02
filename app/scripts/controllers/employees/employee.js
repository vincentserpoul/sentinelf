'use strict';

sentinelfApp.controller(
    'EmployeeCtrl', [
    '$scope', 'employeesFactory', 'employeesGlobaleventFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory',
    function($scope, employeesFactory, employeesGlobaleventFactory, modelStaticLabelsFactory, modelIsoLabelsFactory){

        init();

        function init(){

            /* Get the labels necessary for the list not to be only numbers */
            modelStaticLabelsFactory.get({model:'employee'}, function(data){
                $scope.employeeStaticLabels = data['labels'];
            });

            /* Get the labels necessary for the list of countries not to be only codes */
            $scope.countryList = $scope.$parent.countryList;
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

        /* Display profile tab and hide the two others */
        $scope.showProfile = function(){
            $scope.displayProfile = !$scope.displayProfile;
            $scope.displayPayments=false;
            $scope.displayAssignments=false;
        }

        $scope.editEmployee = function(){

            // Save employer in case of cancel, to rollback to previous values
            $scope.savEmployee = angular.copy($scope.employee);
            // Activate the edit
            $scope.editForm = true;
        }

        $scope.saveEmployee = function(){
            /* Call the factory to update the new employer in db */
            //console.log($scope.employee);
            employeesFactory.update($scope.employer,
                function(data){
                    // when success, reset the savEmployer
                    $scope.savEmployee = null;
                    $scope.editForm = false;
                }
            );
        };

        $scope.cancelEditEmployee = function(){
            // Reset the data to what it was before the edit
            $scope.employee = $scope.savEmployee;
            // Deactivate the edit
            $scope.editForm = false;
        };

        /* Delete employee button for each employee */
        $scope.deleteEmployee= function(){

            var modalInstance = formService.popup('employer', $scope.employer.name);

            modalInstance.result.then(function(){
                employersFactory.delete({employerId:$scope.employer.id},
                    function(data){
                        if(data && data['error'] == false){
                            $scope.employer.delete();
                        } else {
                            console.log(data['error']);
                        }

                    }
                );
            });
        }

}])
