'use strict';

sentinelfApp.controller(
    'EmployeeCtrl', [
    '$scope','formService', 'AlertService', 'employeesFactory', 'employeesGlobaleventPeriodFactory', 'employeesGlobaleventPeriodUnpaidFactory', 'employeeRemarksFactory', 'paymentFactory', 'employeesGlobaleventPeriodpaidFactory',
    function($scope, formService, AlertService, employeesFactory, employeesGlobaleventPeriodFactory, employeesGlobaleventPeriodUnpaidFactory, employeeRemarksFactory, paymentFactory, employeesGlobaleventPeriodpaidFactory){

        $scope.toggleDetails = function(){
            $scope.showProfile();
            $scope.showUnpaidAssignments();
            $scope.showRemarks();
            $scope.showLatestAssignments();
            $scope.showDetails = !$scope.showDetails;
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
                    if(data && data.error === false){
                        AlertService.show({ 'message': data.message, 'type': 'alert-success' }, true);
                        /* hide back the doc forms */
                        angular.extend($scope.employee, data.employee);
                        $scope.savEmployee = null;
                        $scope.profileTemplate = 'views/employees/employeeProfile.html';
                        $scope.busyLoadingProfile = false;
                    }
                }, function (error) {
                    if (error.data){
                        AlertService.show({ 'message': error.data.message, 'type': 'alert-danger' }, false);
                    }
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
                            AlertService.show({ 'message': data.message, 'type': 'alert-success' }, true);
                            var index = $scope.employeesSearchLazyloadFactory.employees.indexOf($scope.employee);
                            $scope.employeesSearchLazyloadFactory.employees.splice(index, 1);
                            $scope.employeesSearchLazyloadFactory.total -= 1;
                        } else {
                            console.log(data.error);
                        }

                    }, function (error) {
                        if (error.data){
                            AlertService.show({ 'message': error.data.message, 'type': 'alert-danger' }, false);
                        }
                    }
                );
            });
        };


        /* Cancel new event creation */
        $scope.cancelNewEmployee = function () {
            $scope.$parent.showNewEmployeeForm = false;
        };

        /* Save new event */
        $scope.createNewEmployee = function() {
            /* Launch service to create new db */
            employeesFactory.create($scope.employee,
                function(data){
                    if(data && data.error === false){
                        AlertService.show({ 'message': data.message, 'type': 'alert-success' }, true);
                        /* hide back the doc forms */
                        $scope.$parent.showNewEmployeeForm = false;
                        $scope.employee = $scope.$parent.defaultEmployee;
                    }
                }, function (error) {
                    if (error.data){
                        AlertService.show({ 'message': error.data.message, 'type': 'alert-danger' }, false);
                    }
                }
            );
        };

        /* EmployeeContact related functions */
        /* Delete employee doc */
        $scope.deleteEmployeeContact = function(employeeContact){
            var index = $scope.employee.employee_contact.indexOf(employeeContact);
            $scope.employee.employee_contact.splice(index, 1);
        };
        /* Add employee doc */
        $scope.addEmployeeContact = function(){
            /* We need to copy to make sure a new element is created each time */
            $scope.employee.employee_contact.unshift(this.newEmployeeContact);

            /* hide back the form */
            this.newEmployeeContact = null;
            this.showEmployeeContactForm =false;
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
            $scope.employee.employee_doc.unshift(this.newEmployeeDoc);

            /* hide back the form */
            this.newEmployeeDoc = null;
            this.showEmployeeDocForm =false;
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
            this.showEmployeeIdentityDocForm = false;
            /* We need to copy to make sure a new element is created each time */
            $scope.employee.employee_identity_doc.unshift(angular.copy(this.newEmployeeIdentityDoc));
        };


        /* Display list of remarks */
        $scope.showRemarks = function(){
            if(!$scope.showDetails){
                /* display loading  */
                $scope.busyLoadingRemarks = true;
                $scope.showNewRemarkForm = false;
                /* get Data */
                employeeRemarksFactory.get({employeeId: $scope.employee.id}, function(data){

                    $scope.remarks = data.employee_remarks;
                    /* Push the template to the page */
                    $scope.remarksTemplate = 'views/employees/employeeRemarks.html';
                    /* stop loading and display */
                    $scope.busyLoadingRemarks = false;
                });
            }
        };

        /* Display remark */
        $scope.toggleRemarks = function(){
            $scope.showNewRemarkForm = !$scope.showNewRemarkForm;
        };

        /* Display new form */
        $scope.createNewRemark = function(){
            /* get Data */
            /* Launch service to create new remark */
            var newEmployeeRemark = new employeeRemarksFactory;
            newEmployeeRemark.employeeId = $scope.employee.id;
            newEmployeeRemark.remark = $scope.new_remark;
            newEmployeeRemark.$save(
                function(data){
                    if(data && data.error === false){
                        AlertService.show({ 'message': data.message, 'type': 'alert-success' }, true);
                        /* hide back the doc forms */
                        $scope.remarks.unshift(data.employee_remark);
                        $scope.showNewRemarkForm = !$scope.showNewRemarkForm;
                    }
                }, function (error) {
                    if (error.data){
                        AlertService.show({ 'message': error.data.message, 'type': 'alert-danger' }, false);
                    }
                }
            );
        };

        /* Display latest 10 assignments */
        $scope.showLatestAssignments = function(){
            if(!$scope.showDetails){
                /* display loading  */
                $scope.busyLatestAssignments = true;
                /* get Data */
                employeesGlobaleventPeriodFactory.get({employeeId: $scope.employee.id}, function(data){
                    $scope.latestGlobaleventPeriods = data.globalevent_periods;
                    /* Push the template to the page */
                    $scope.latestAssignmentsTemplate = 'views/employees/employeeLatestAssignments.html';
                    /* stop loading and display */
                    $scope.busyLoadingLatestAssignments = false;
                });
            }
        };


        /* Display profile tab and hide the two others */
        $scope.showUnpaidAssignments = function(){
            if(!$scope.showDetails){
                /* display loading  */
                $scope.busyLoadingUnpaidAssignments = true;

                /* get Data */
                employeesGlobaleventPeriodUnpaidFactory.get({employeeId: $scope.employee.id}, function(data){
                    $scope.unpaidGlobaleventPeriods = data.globalevent_periods;
                    /* Push the template to the page */
                    $scope.unpaidAssignmentsTemplate = 'views/employees/employeeUnpaidAssignments.html';
                    /* stop loading and display */
                    $scope.busyLoadingUnpaidAssignments = false;
                });
            }
        };

        /* Add an assignment to payment */
        $scope.removeFromPayment = function(){
            /* Remove from unpaid */
            var index = $scope.unpaidGlobaleventPeriods.indexOf(this.unpaidAssignment);
            $scope.unpaidGlobaleventPeriods.splice(index, 1);
        };

        /* Add apayment from scratch */
        $scope.createNewPayment = function(){
            /* get Data */
            /* Launch service to create new remark */
            var newPayment = new paymentFactory;
            newPayment.amount = $scope.new_payment.amount;
            newPayment.currency_code = $scope.new_payment.currency_code;
            newPayment.employeeId = $scope.employee.id;


            newPayment.$save(
                function(data){
                    if(data && data.error === false){
                        AlertService.show({ 'message': data.message, 'type': 'alert-success' }, true);
                        /* hide back from unpaid */
                        //$scope.remarks.unshift(data.employee_payment);
                        $scope.showNewRemarkForm = !$scope.showNewRemarkForm;
                    }
                }, function (error) {
                    if (error.data){
                        AlertService.show({ 'message': error.data.message, 'type': 'alert-danger' }, false);
                    }
                }
            );
        }

        /* Add employee identity doc */
        $scope.payEmployee = function(){
            var topayGlobaleventPeriods = Array();
            var topayGlobaleventPeriodsIndexes = Array();
            /* Get global event period ids */
            angular.forEach($scope.unpaidGlobaleventPeriods, function(globaleventPeriodEmployee, index){
                topayGlobaleventPeriods.unshift(globaleventPeriodEmployee.globalevent_period_employee_id);
                topayGlobaleventPeriodsIndexes.unshift(index);
            })
            var modalInstance = formService.popup('Pay employee', 'Confirm you want to pay employee ?');
            modalInstance.result.then(function(){
                var payment = new paymentFactory;
                payment.globalevent_period_employee_ids = topayGlobaleventPeriods;
                /* normal payments */
                payment.payment_type_id = 1;
                payment.$save(
                    function(data){
                        if(data && data.error === false){
                            AlertService.show({ 'message': data.message, 'type': 'alert-success' }, true);
                            /* remove the payment from the list */
                            angular.forEach(topayGlobaleventPeriodsIndexes, function(value, index){
                                $scope.unpaidGlobaleventPeriods.splice(value, 1);
                            });
                        }
                    }, function (error) {
                        if (error.data){
                            AlertService.show({ 'message': error.data.message, 'type': 'alert-danger' }, false);
                        }
                    }
                );
            });
        };
    }
]);
