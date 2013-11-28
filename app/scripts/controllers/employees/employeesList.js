'use strict';

sentinelfApp.controller(
    'EmployeesListCtrl', [
    '$scope', 'employeesFactory', 'modelStaticLabelsFactory',
    function($scope, employeesFactory, modelStaticLabelsFactory) {

        init();

        /* Regroup init of the page in one single function */
        function init() {

            /* Get the employee list */
            employeesFactory.get(function(data){
                $scope.employees = data['employees'];
            });

            /* Get the labels necessary for the list not to be only numbers */
            modelStaticLabelsFactory.get({model:'employee'}, function(data){
                $scope.employeeStaticLabels = data['labels'];
            });

        }
    }
]);

sentinelfApp.controller(
    'EmployeeVVVVCtrl', [
    '$scope', 'employeesFactory',
    function($scope, employeesFactory){


        $scope.editEmployee = function(){

            // Save employer in case of cancel, to rollback to previous values
            $scope.savEmployee = angular.copy($scope.employee);
            // Activate the edit
            $scope.editForm = true;
        }

        $scope.saveEmployer = function(){
            /* Call the factory to update the new employer in db */
            //console.log($scope.employer);
            employersFactory.update($scope.employer,
                function(data){
                    // when success, reset the savEmployer
                    $scope.savEmployer = null;
                    $scope.editForm = false;
                }
            );
        };

        $scope.cancelEditEmployer = function(){
            // Reset the data to what it was before the edit
            $scope.employer = $scope.savEmployer;
            // Deactivate the edit
            $scope.editForm = false;
        };

        /* Delete employee button for each employee */
        $scope.deleteEmployer = function(){

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
