'use strict';

sentinelfApp.controller('DepartmentsCtrl', ['$scope', 'formService', 'AlertService', 'departmentsFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', function($scope, formService, AlertService, departmentsFactory, modelStaticLabelsFactory, modelIsoLabelsFactory) {

    init();

    /* Regroup init of the page in one single function */
    function init() {
        $scope.detailReady = 'disabled';
        departmentsFactory.get({employer_id : $scope.employer.id}, function (data) {
            $scope.departments = data['EmployerDepartments'];
            /* Get the labels necessary for the list not to be only numbers */
            modelStaticLabelsFactory.get({model:'department'}, function (data) {
                $scope.departmentStaticLabels = data['labels'];
                //get currency code
                modelIsoLabelsFactory.get({model:'currency'}, function (data) {
                    $scope.currencyIsoLabels = data['labels']['currency'];
                    // get labels from codes and id
                    for (var i in $scope.departments) {
                        $scope.departments[i].work_type = formService.findObjectById($scope.departmentStaticLabels['work_type'], $scope.departments[i].work_type_id);
                        $scope.departments[i].employee_hourly_rate_currency = formService.findObjectByCode($scope.currencyIsoLabels, $scope.departments[i].employee_hourly_rate_currency_code);
                        $scope.departments[i].employer_hourly_rate_currency = formService.findObjectByCode($scope.currencyIsoLabels, $scope.departments[i].employer_hourly_rate_currency_code);
                        getLabelsFromCodesAndIds($scope.departments[i]);
                    }
                    $scope.detailReady = '';
                })
            }); 
        });

        $scope.selectedDepartment = {'label': 'None'};
    };

    $scope.editDepartment = function () {
        // Activate the edit
        $scope.editForm = true;
    }

    $scope.saveDepartment = function () {
        /* Call the factory to update the new employer in db */
        //update codes
        $scope.selectedDepartment.work_type_id = $scope.selectedDepartment.work_type['id'];
        $scope.selectedDepartment.employee_hourly_rate_currency_code = $scope.selectedDepartment.employee_hourly_rate_currency['id'];
        $scope.selectedDepartment.employer_hourly_rate_currency_code = $scope.selectedDepartment.employer_hourly_rate_currency['id'];
        departmentsFactory.update($scope.selectedDepartment,
            function (data) {
                if (data) {
                    // when success, reset the savEmployer
                    $scope.departmentTree.currentNode = $scope.selectedDepartment;
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true); 
                }
            }, function (error) {
                if (error['data'])
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false); 
            }
        );
        $scope.editForm = false;   
    };

    $scope.cancelEditDepartment = function () {
        // Reset the data to what it was before the edit
        $scope.selectedDepartment = angular.copy($scope.departmentTree.currentNode);
        // shallow copy codes and ids
        $scope.selectedDepartment.work_type = $scope.departmentTree.currentNode.work_type;
        $scope.selectedDepartment.employee_hourly_rate_currency = $scope.departmentTree.currentNode.employee_hourly_rate_currency;
        $scope.selectedDepartment.employer_hourly_rate_currency = $scope.departmentTree.currentNode.employer_hourly_rate_currency;
        // Deactivate the edit
        $scope.editForm = false;
    };

    /* Delete employee button for each employee */
    $scope.deleteDepartment = function(){

        var modalInstance = formService.popup('department', $scope.selectedDepartment.label);

        modalInstance.result.then(function(){
            departmentsFactory.delete({departmentId:$scope.selectedDepartment.id},
                function (data) {
                    $scope.selectedDepartment.delete();
                    if (data)
                        AlertService.show({ "message": data['message'], "type": 'alert-success' }, true); 
                }, function (error) { 
                    if (error['data'])
                        AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false); 
                }
            );
        });
    }

    $scope.$watch( 'departmentTree.currentNode', function( newObj, oldObj ) {
        if( $scope.departmentTree && angular.isObject($scope.departmentTree.currentNode) ) {
            $scope.selectedDepartment = angular.copy($scope.departmentTree.currentNode);
            // shallow copy codes and ids
            $scope.selectedDepartment.work_type = $scope.departmentTree.currentNode.work_type;
            $scope.selectedDepartment.employee_hourly_rate_currency = $scope.departmentTree.currentNode.employee_hourly_rate_currency;
            $scope.selectedDepartment.employer_hourly_rate_currency = $scope.departmentTree.currentNode.employer_hourly_rate_currency;
            $scope.editForm = false;
        }
    }, false);

    function getLabelsFromCodesAndIds (department) {
        department.work_type = formService.findObjectById($scope.departmentStaticLabels['work_type'], department.work_type_id);
        department.employee_hourly_rate_currency = formService.findObjectByCode($scope.currencyIsoLabels, department.employee_hourly_rate_currency_code);
        department.employer_hourly_rate_currency = formService.findObjectByCode($scope.currencyIsoLabels, department.employer_hourly_rate_currency_code);
        if (!department['children']) 
            return;
        for (var i in department['children']) {
            getLabelsFromCodesAndIds(department['children'][i]);
        }
    }

}]);