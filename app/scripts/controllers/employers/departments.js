'use strict';

sentinelfApp.controller('DepartmentsCtrl', ['$scope', 'formService', 'AlertService', 'departmentsFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', function($scope, formService, AlertService, departmentsFactory, modelStaticLabelsFactory, modelIsoLabelsFactory) {

    init();

    /* Regroup init of the page in one single function */
    function init() {
        $scope.detailReady = 'disabled';
        departmentsFactory.get({employer_id : $scope.employer.id}, function (data) {
            $scope.departments = data['EmployerDepartments'];
        });

        $scope.departmentsStaticLabelsResource = modelStaticLabelsFactory.get({model:'department'});
        $scope.currencyIsoLabelsResource = modelIsoLabelsFactory.get({model:'currency'});

        $scope.selectedDepartments = [{'label': 'None'}];
    };

    $scope.editDepartment = function () {
        // Activate the edit
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
                    // when success, reset the savEmployer
                    $scope.departmentTree.currentNode = $scope.selectedDepartments[0];
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

    $scope.newSubdepartment = function () {
        $scope.new = true;
        $scope.editForm = true;
        $scope.selectedDepartments = 
            [{'label': 'New department', 
            'description': 'description',
            'work_type_id': 1,
            'employer_hourly_rate': 9,
            'employer_hourly_rate_currency_code': 'SGD', 
            'employee_hourly_rate': 9, 
            'employee_hourly_rate_currency_code': 'SGD'}];
    }

    $scope.$watch( 'departmentTree.currentNode', function (newObj, oldObj) {
        if( $scope.departmentTree && angular.isObject($scope.departmentTree.currentNode) ) {
            $scope.selectedDepartments = [angular.copy($scope.departmentTree.currentNode)];
            $scope.editForm = false;
        }
    }, false);

    $scope.$watch( 'selectedDepartments', function (newObj, oldObj) {
        if ($scope.selectedDepartments[0].label != 'None' && $scope.departmentsStaticLabelsResource && $scope.currencyIsoLabelsResource) {
            $scope.detailReady = 'enabled';
        }
    });
}]);