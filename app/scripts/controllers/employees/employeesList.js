'use strict';

sentinelfApp.controller(
    'EmployeesListCtrl', [
    '$scope', 'AlertService', 'employeesSearchLazyloadFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', 'employeesFactory', 'employeesGlobaleventPeriodFactory', 'employeesGlobaleventPeriodUnpaidFactory',
    function ($scope, AlertService, employeesSearchLazyloadFactory, modelStaticLabelsFactory, modelIsoLabelsFactory, employeesFactory, employeesGlobaleventPeriodFactory, employeesGlobaleventPeriodUnpaidFactory) {

        /* Regroup init of the page in one single function */
        function init() {

            /* Get the labels necessary for the list not to be only numbers */
            $scope.staticLabelListResource = modelStaticLabelsFactory.get({model:'employee'}, function(data){
                $scope.employeeStaticLabels = data.labels;
            });

            /* Get the labels necessary for the list of countries not to be only codes */
            $scope.countryListResource = modelIsoLabelsFactory.get({model:'country'}, function(data){
                $scope.countries = data.labels.country;
            });

            $scope.showNewForm = false;

        }

        init();

        $scope.searchEmployees = function (){
            /* Load the progressive service to load list of employees */
            $scope.employeesSearchLazyloadFactory = new employeesSearchLazyloadFactory(this.searchCriterias);
            /* First launch */
            $scope.employeesSearchLazyloadFactory.loadMore();
            /* display the search results */
            $scope.displayList = true;
        };

        $scope.clearEmployees = function (){
            /* Load the progressive service to load list of employees */
            $scope.employeesSearchLazyloadFactory = null;
            /* hide search results */
            $scope.displayList = false;
            /* criterias resetted too */
            this.searchCriterias = null;
        };

        /* Display new form */
        $scope.showNewEmployee = function () {
            $scope.showNewForm = !$scope.showNewForm;

            if($scope.showNewForm){

                /* Create a defulat empty employee */
                $scope.employee = {
                    'title_id':1,
                    'sex_id':1,
                    'country_code':'SGP',
                    'date_of_birth':'1980-01-01',
                    'race_id':1,
                    'status_id':1,
                    'work_pass_type_id':1,
                    'employee_identity_doc':[],
                    'employee_doc':[]
                };
            } else {
                $scope.employeeNewTemplate = '';
            }
        };

        $scope.toggleDetails = function(){
            $scope.showProfile();
            $scope.showDetails = !$scope.showDetails;
        };

        /* Display profile tab and hide the two others */
        $scope.showAssignments = function(){
            /* render optimization */
            $scope.employee.shownAssignments = true;

            /* get Data */
            employeesGlobaleventPeriodFactory.get({employeeId: $scope.employee.id}, function(data){
                $scope.globaleventPeriods = data.globalevent_periods;
            });
        };

        /* Display profile tab and hide the two others */
        $scope.showUnpaidAssignments = function(){
            /* render optimization */
            $scope.employee.shownUnpaidAssignments = true;

            /* get Data */
            employeesGlobaleventPeriodUnpaidFactory.get({employeeId: $scope.employee.id}, function(data){
                $scope.unpaidGlobaleventPeriods = data.globalevent_periods;
            });
        };

        /* Display profile tab and hide the two others */
        $scope.showProfile = function(){

            /* get Data for the specific employee if it is not there yet (if sex_id is there, it means we got the employee) */
            if(!$scope.employee.sex_id){
                /* display loading profile */
                $scope.busyLoadingProfile = true;
                employeesFactory.get({employeeId: $scope.employee.id}, function(data){
                    /* Merge new data with existing employee object */
                    angular.extend($scope.employee, data.employees[0]);
                    /* Push the template to the profile tab */
                    $scope.profileTemplate = 'views/employees/employeeProfile.html';
                    /* stop loading and display */
                    $scope.busyLoadingProfile = false;
                });
            }
        };

        $scope.editEmployee = function(){
            /* Save client in case of cancel, to rollback to previous values */
            $scope.savEmployee = angular.copy($scope.employee);
            /* Activate the edit form */
            $scope.profileTemplate = 'views/employees/employeeEdit.html';
        };

        $scope.saveEmployee = function(){
            /* hide back the doc forms */
            $scope.employeeDocForm = false;
            $scope.employeeIdentityDocForm = false;
            $scope.busyLoadingProfile = false;

            /* Call the factory to update the employee in db */
            employeesFactory.update({employeeId: $scope.employee.id}, $scope.employee,
                function(data){
                    angular.extend($scope.employee, data.employee);
                    $scope.savEmployee = null;
                    $scope.profileTemplate = 'views/employees/employeeProfile.html';
                    $scope.busyLoadingProfile = false;
                }
            );

        };

        $scope.cancelEditEmployee = function(){
            // Reset the data to what it was before the edit
            $scope.employee = $scope.savEmployee;
            // Deactivate the edit
            $scope.profileTemplate = 'views/employees/employeeProfile.html';
        };

        /* Delete employee button for each employee */
        $scope.deleteEmployee= function(){

            var modalInstance = formService.popup('employee', $scope.employee.first_name +' '+ $scope.employee.last_name);

            modalInstance.result.then(function(){
                employeesFactory.delete({employeeId:$scope.employee.id},
                    function(data){
                        if(data && data.error === false){
                            $scope.employee.delete();
                        } else {
                            console.log(data.error);
                        }

                    }
                );
            });
        };

        /* Cancel new event creation */
        $scope.cancelNewEmployee = function () {
            $scope.showNewEmployee();
        };

        /* Save new event */
        $scope.createNewEmployee = function() {
            /* hide back the doc forms */
            $scope.showNewForm = false;
            /* Launch service to create new db */
            employeesFactory.create($scope.employee,
                function(data){
                    if(data && data.error === false){
                        AlertService.show({ 'message': data.message, 'type': 'alert-success' }, true);
                    }
                }, function (error) {
                    if (error.data){
                        AlertService.show({ 'message': error.data.message, 'type': 'alert-danger' }, false);
                    }
                }
            );
        };

        /* EmployeeDoc related functions */
        /* Delete employee doc */
        $scope.deleteEmployeeDoc = function(employeeDoc){
            var index = $scope.employee.employee_doc.indexOf(employeeDoc);
            $scope.employee.employee_doc.splice(index, 1);
        };
        /* Add employee doc */
        $scope.addEmployeeDoc = function(){
            /* We need to copy to make sure a new element is created each time */
            $scope.employee.employee_doc.unshift($scope.newEmployeeDoc);

            /* hide back the form */
            $scope.newEmployeeDoc = null;
            $scope.employeeDocForm = !$scope.employeeDocForm;
        };

        /* Employee Identity doc related function */
        /* Delete employee identity doc */
        $scope.deleteEmployeeIdentityDoc = function(employeeIdentityDoc){
            var index = $scope.employee.employee_identity_doc.indexOf(employeeIdentityDoc);
            $scope.employee.employee_identity_doc.splice(index, 1);
        };

        /* Add employee identity doc */
        $scope.addEmployeeIdentityDoc = function(){
            /* hide back the form */
            $scope.employeeIdentityDocForm = false;
            $scope.newEmployeeIdentityDoc.identity_doc_type_id = $scope.newEmployeeIdentityDoc.identity_doc_type.id;
            /* We need to copy to make sure a new element is created each time */
            $scope.employee.employee_identity_doc.unshift(angular.copy($scope.newEmployeeIdentityDoc));
        };

        /* Add employee identity doc */
        $scope.payEmployee = function(){
            var modalInstance = formService.popup('Pay employee', 'Confirm you want to pay employee ?', 'update.html');
            modalInstance.result.then(function(){

             });
        };
    }
]);
