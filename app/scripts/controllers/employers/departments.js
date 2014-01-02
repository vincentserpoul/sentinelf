'use strict';

sentinelfApp.controller('DepartmentsCtrl', ['$scope', 'formService', 'AlertService', 'departmentsFactory', 'departmentsLazyloadFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', function($scope, formService, AlertService, departmentsFactory, departmentsLazyloadFactory, modelStaticLabelsFactory, modelIsoLabelsFactory) {

    init();

    /* Regroup init of the page in one single function */
    function init() {
        $scope.detailReady = 'disabled';
        $scope.selectedDepartments = [{'label': 'None'}];
    };

    $scope.showDetail = function () {
        $scope.newForm = false;
    }

    $scope.editDepartment = function () {
        // Activate the edit
        $scope.newForm = false;
        $scope.editForm = true;
    }

    $scope.saveDepartment = function () {
        /* Call the factory to update the new employer in db */
        //update codes
        $scope.selectedDepartments[0].work_type_id = $scope.selectedDepartments[0].work_type['id'];
        $scope.selectedDepartments[0].employee_hourly_rate_currency_code = $scope.selectedDepartments[0].employee_hourly_rate_currency['code'];
        $scope.selectedDepartments[0].employer_hourly_rate_currency_code = $scope.selectedDepartments[0].employer_hourly_rate_currency['code'];
        departmentsFactory.update($scope.selectedDepartments[0],
            function (data) {
                if (data) {
                    $scope.departments = data['EmployerDepartments'];
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
        $scope.selectedDepartments = [angular.copy($scope.departmentTree.currentNode)];
        // Deactivate the edit
        $scope.editForm = false;
    };

    /* Delete employee button for each employee */
    $scope.deleteDepartment = function(){

        var modalInstance = formService.popup('department', $scope.selectedDepartments[0].label);

        modalInstance.result.then(function(){
            departmentsFactory.delete({departmentId:$scope.selectedDepartments[0].id},
                function (data) {
                    if (data) {
                        $scope.selectedDepartments = [{'label': 'None'}];
                        $('#collapseDepartment' + $scope.employer.id).collapse('hide');
                        $scope.departments = data['EmployerDepartments'];
                        AlertService.show({ "message": data['message'], "type": 'alert-success' }, true); 
                    }
                }, function (error) { 
                    if (error['data'])
                        AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false); 
                }
            );
        });


    }

    function initNewDepartmentValues () {
        formService.initValues($scope.selectedDepartments[0]);
        $scope.newForm = true;
    }

    $scope.newDepartment = function (parent_id) {
        parent_id = (parent_id) ? parent_id : null;
        $scope.selectedDepartments = 
            [{'parent_id': parent_id,
            'employer_id': $scope.employer.id,
            'label': 'New department', 
            'description': 'description',
            'work_type_id': 1,
            'employer_hourly_rate': 9,
            'employer_hourly_rate_currency_code': 'SGD', 
            'employee_hourly_rate': 9, 
            'employee_hourly_rate_currency_code': 'SGD'}];
        if(!($scope.departmentsStaticLabelsResource && $scope.currencyIsoLabelsResource)) { 
            $scope.loadDepartmentsResource().$promise.then(function () {
                initNewDepartmentValues();
            })
        } else initNewDepartmentValues();
    }

    $scope.saveNewDepartment = function () {
        $scope.newForm = false;
        /* Call the factory to update the new department in db */
        departmentsFactory.save($scope.selectedDepartments[0],
            function (data) {
                if (data) {
                    $scope.departments = data['EmployerDepartments'];
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }
            }, function (error) {
                if (error['data'])
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
            }
        );
        $scope.selectedDepartments = [angular.copy($scope.departmentTree.currentNode)];
    }

    $scope.cancelNewDepartment = function () {
        $scope.newForm = false;
        $scope.selectedDepartments = [angular.copy($scope.departmentTree.currentNode)];
    }

    $scope.$watch( 'departmentTree.currentNode', function (newObj, oldObj) {
        if( $scope.departmentTree && angular.isObject($scope.departmentTree.currentNode) ) {
            $scope.selectedDepartments = [angular.copy($scope.departmentTree.currentNode)];
            $scope.editForm = false;
            $scope.newForm = false;
        }
    }, false);

    $scope.$watch( 'selectedDepartments', function (newObj, oldObj) {
        if ($scope.selectedDepartments[0].label != 'None' && $scope.departmentsStaticLabelsResource && $scope.currencyIsoLabelsResource) {
            $scope.detailReady = 'enabled';
        } else if ($scope.selectedDepartments[0].label == 'None') {
            $scope.detailReady = 'disabled';
        }
    });

    $scope.$watch( 'newForm', function (newObj, oldObj) {
        if (newObj == true) {
            if (angular.element('#collapseDepartment' + $scope.employer.id).hasClass('in')) {
                $('#collapseDepartment' + $scope.employer.id).collapse('hide');
            }
        } else if (oldObj == true && newObj == false) {
            if (angular.element('#collapseNewDepartment' + $scope.employer.id).hasClass('in')) {
                $('#collapseNewDepartment' + $scope.employer.id).collapse('hide');
            }
        }
    })
}]);