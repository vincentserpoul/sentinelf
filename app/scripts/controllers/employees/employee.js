'use strict';

sentinelfApp.controller(
    'EmployeeCtrl', [
    '$scope','formService', 'AlertService', 'employeesFactory', 'employeesGlobaleventPeriodFactory', 'employeesGlobaleventPeriodUnpaidFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory',
    function($scope, formService, AlertService, employeesFactory, employeesGlobaleventPeriodFactory, employeesGlobaleventPeriodUnpaidFactory, modelStaticLabelsFactory, modelIsoLabelsFactory){

        $scope.toggleDetails = function(){
            $scope.showDetails = !$scope.showDetails;
        }

        /* Display profile tab and hide the two others */
        $scope.showAssignments = function(){
            /* render optimization */
            $scope.employee.shownAssignments = true;

            /* get Data */
            employeesGlobaleventPeriodFactory.get({employeeId: $scope.employee.id}, function(data){
                $scope.globaleventPeriods = data['globalevent_periods'];
            });
        }

        /* Display profile tab and hide the two others */
        $scope.showUnpaidAssignments = function(){
            /* render optimization */
            $scope.employee.shownUnpaidAssignments = true;

            /* get Data */
            employeesGlobaleventPeriodUnpaidFactory.get({employeeId: $scope.employee.id}, function(data){
                $scope.unpaidGlobaleventPeriods = data['globalevent_periods'];
            });
        }

        /* Display profile tab and hide the two others */
        $scope.showProfile = function(){

            /* Get the labels necessary for the list of countries not to be only codes */
            $scope.countryListResource.$promise.then(function(data){
                $scope.countries = data['labels']['country'];
            });

            /* get Data for the specific employee if it is not there yet (if sex_id is there, it means we got the employee) */
            if(!$scope.employee.sex_id){
                employeesFactory.get({employeeId: $scope.employee.id}, function(data){
                    $scope.employee = data['employees'][0];
                });
            }
        }


        $scope.newEmployee = function(){
            // Create a defulat empty employee
            var defaultEmployee = {
                 "title_id":1
                ,"first_name":"First name"
                ,"last_name":"Last name"
                ,"sex_id":1
                ,"country_code":"SGP"
                ,"date_of_birth":"1980-01-01"
                ,"mobile_phone_number":"+65"
                ,"school":"School"
                ,"join_date":"2012-02-03 00:00:00"
                ,"race_id":1
                ,"status_id":1
                ,"work_pass_type_id":1
                ,"employee_identity_doc":[]
                ,"employee_doc":[]
            };
            // Add it to the list!
            $scope.displayProfile = true;
            $scope.employeesSearchLazyloadFactory.employees.unshift(defaultEmployee);
            $scope.showProfile();
            $scope.editForm = true;
        }

        $scope.cancelAddEmployee = function(){
            /* remove the first element of the employees array */
            $scope.employeesSearchLazyloadFactory.employees.splice(0,1);
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
            /* hide back the doc forms */
            $scope.employeeDocForm = false;
            $scope.employeeIdentityDocForm = false;

            /* Call the factory to update/create the employee in db */
            if(angular.isDefined($scope.employee.id)){
                employeesFactory.update({employeeId: $scope.employee.id}, $scope.employee,
                    function(data){
                        // when success, reset the savEmployer
                        $scope.employee = data['employee'];
                        $scope.savEmployee = null;
                        $scope.editForm = false;
                    }
                );
            } else {
                employeesFactory.create($scope.employee,
                    function(data){
                        // when success, reset the savEmployer
                        $scope.savEmployee = null;
                        $scope.employee = data['employee'];
                        $scope.editForm = false;
                    }
                );
            }

        };

        $scope.cancelEditEmployee = function(){
            // Reset the data to what it was before the edit
            $scope.employee = $scope.savEmployee;
            // Deactivate the edit
            $scope.editForm = false;
        };

        /* Delete employee button for each employee */
        $scope.deleteEmployee= function(){

            var modalInstance = formService.popup('employee', $scope.employee.first_name +' '+ $scope.employee.last_name);

            modalInstance.result.then(function(){
                employeesFactory.delete({employeeId:$scope.employee.id},
                    function(data){
                        if(data && data['error'] == false){
                            $scope.employee.delete();
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
            console.log($scope.newEmployeeDoc);
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

        /* Add employee identity doc */
        $scope.payEmployee = function(){
            var modalInstance = formService.popup('Pay employee', "Confirm you want to pay employee ?", 'update.html');
            modalInstance.result.then(function(){

             });

        }

}])
