'use strict';

sentinelfApp.controller(
    'EmployeeCtrl', [
    '$scope', 'employeesFactory', 'employeesGlobaleventPeriodFactory', 'employeesGlobaleventPeriodUnpaidFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory',
    function($scope, employeesFactory, employeesGlobaleventPeriodFactory, employeesGlobaleventPeriodUnpaidFactory, modelStaticLabelsFactory, modelIsoLabelsFactory){

        init();

        /* Regroup init of the page in one single function */
        function init() {
            $scope.editForm = false;
        }

        /* Display profile tab and hide the two others */
        $scope.showAssignments = function(){
            $scope.displayProfile=false;
            $scope.displayPayments=false;
            $scope.displayAssignments = !$scope.displayAssignments;
            $scope.displayUnpaidAssignments=false;

            if($scope.displayAssignments){
                employeesGlobaleventPeriodFactory.get({employeeId: $scope.employee.id}, function(data){
                    $scope.globaleventPeriods = data['globalevent_periods'];
                });
            }
        }

        /* Display profile tab and hide the two others */
        $scope.showUnpaidAssignments = function(){
            $scope.displayProfile=false;
            $scope.displayPayments=false;
            $scope.displayAssignments = false;
            $scope.displayUnpaidAssignments=!$scope.displayUnpaidAssignments;

            if($scope.displayUnpaidAssignments){
                employeesGlobaleventPeriodUnpaidFactory.get({employeeId: $scope.employee.id}, function(data){
                    $scope.unpaidGlobaleventPeriods = data['globalevent_periods'];
                });
            }
        }

        /* Display profile tab and hide the two others */
        $scope.showProfile = function(){
            $scope.displayProfile = !$scope.displayProfile;
            $scope.displayPayments=false;
            $scope.displayAssignments=false;
            $scope.displayUnpaidAssignments=false;
        }

        $scope.editEmployee = function(){

            // Save employer in case of cancel, to rollback to previous values
            $scope.savEmployee = angular.copy($scope.employee);
            // Activate the edit
            $scope.editForm = true;
            /* init the add employee doc form */
            $scope.addNewEmployeeDocForm  = false;
            /* init the add employee identity doc form */
            $scope.addNewEmployeeIdentityDocForm  = false;
        }

        $scope.saveEmployee = function(){

            /* Needed because the input return a damn json array */
            $scope.employee.country_code = $scope.employee.country.code;
            $scope.employee.work_pass_type_id = $scope.employee.work_pass_type.id;
            $scope.employee.race_id = $scope.employee.race.id;
            $scope.employee.status_id = $scope.employee.status.id;

            /* Call the factory to update the employee in db */
            employeesFactory.update($scope.employee,
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

        /* EmployeeDoc related functions */
        /* Delete employee doc */
        $scope.deleteEmployeeDoc = function(employeeDoc){
            var index = $scope.employee.employee_doc.indexOf(employeeDoc);
            $scope.employee.employee_doc.splice(index, 1);
        }
        /* Add employee doc */
        $scope.addEmployeeDoc = function(){
            /* hide back the form */
            $scope.employeeDocForm = false;
            $scope.newEmployeeDoc.doc_type_id = $scope.newEmployeeDoc.doc_type.id;
            /* We need to copy to make sure a new element is created each time */
            $scope.employee.employee_doc.unshift(angular.copy($scope.newEmployeeDoc));
        }

        /* Employee Identity doc related function */
        /* Delete employee identity doc */
        $scope.deleteEmployeeIdentityDoc = function(employeeIdentityDoc){
            var index = $scope.employee.employee_identity_doc.indexOf(employeeIdentityDoc);
            $scope.employee.employee_identity_doc.splice(index, 1);
        }

        /* Add employee identity doc */
        $scope.addEmployeeIdentityDoc = function(){
            /* hide back the form */
            $scope.employeeIdentityDocForm = false;
            $scope.newEmployeeIdentityDoc.identity_doc_type_id = $scope.newEmployeeIdentityDoc.identity_doc_type.id;
            /* We need to copy to make sure a new element is created each time */
            $scope.employee.employee_identity_doc.unshift(angular.copy($scope.newEmployeeIdentityDoc));
        }
}])
