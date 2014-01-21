'use strict';

sentinelfApp.controller('DepartmentsCtrl', ['$scope', 'formService', 'AlertService', 'departmentFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', function($scope, formService, AlertService, departmentFactory, modelStaticLabelsFactory, modelIsoLabelsFactory) {

    init();

    /* Regroup init of the page in one single function */
    function init() {
        $scope.detailReady = 'disabled';
        departmentFactory.get({client_id : $scope.client.id}, function (data) {
            $scope.departments = data['ClientDepartments'];
        });

        modelStaticLabelsFactory.get({model:'department'}, function (data) {
            $scope.work_types = data['labels']['work_type'];
        });
        modelIsoLabelsFactory.get({model:'currency'}, function (data) {
            $scope.currencies = data['labels']['currency'];
        });

        $scope.selectedDepartment = {'label': 'None'};

        $scope.viewTemplate = 'views/clients/departments/departmentView.html';
        $scope.editTemplate = 'views/clients/departments/departmentEdit.html';
        $scope.departmentTemplate = $scope.viewTemplate;
    };

    $scope.showDetail = function () {
        // hide new panel and show detail panel
        $scope.detailShow = !$scope.detailShow;
        $scope.showNew = false;
    }

    $scope.editDepartment = function () {
        // Load edit template
        $scope.departmentTemplate = $scope.editTemplate;
    }

    $scope.saveDepartment = function () {
        /* Call the factory to update the new client in db */
        //update codes
        departmentFactory.update($scope.selectedDepartment,
            function (data) {
                if (data) {
                    $scope.departments = data['ClientDepartments'];
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
        // Load view template
        $scope.departmentTemplate = $scope.viewTemplate;
    };

    /* Delete employee button for each employee */
    $scope.deleteDepartment = function(){

        var modalInstance = formService.popup('department', $scope.selectedDepartment.label);

        modalInstance.result.then(function(){
            departmentFactory.delete({departmentId:$scope.selectedDepartment.id},
                function (data) {
                    if (data) {
                        $scope.selectedDepartment = {'label': 'None'};
                        $scope.detailShow = false;
                        $scope.departments = data['ClientDepartments'];
                        AlertService.show({ "message": data['message'], "type": 'alert-success' }, true); 
                    }
                }, function (error) { 
                    if (error['data'])
                        AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false); 
                }
            );
        });


    }

    $scope.newDepartment = function (parent_id) {
        parent_id = (parent_id) ? parent_id : null;
        $scope.new_department = 
            {'parent_id': parent_id,
            'client_id': $scope.client.id,
            'label': 'New department', 
            'description': 'description',
            'work_type_id': 1,
            'client_h_rate': 9,
            'client_h_rate_currency_code': 'SGD', 
            'employee_h_rate': 9, 
            'employee_h_rate_currency_code': 'SGD'};
        $scope.showNew = true;
        $scope.detailShow = false;
    }

    $scope.saveNewDepartment = function () {
        /* Call the factory to update the new department in db */
        departmentFactory.save($scope.new_department,
            function (data) {
                if (data) {
                    $scope.departments = data['ClientDepartments'];
                    $scope.showNew = false;
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }
            }, function (error) {
                if (error['data'])
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
            }
        );
    }

    $scope.cancelNewDepartment = function () {
        $scope.showNew = false;
    }

    $scope.$watch( 'departmentTree.currentNode', function (newObj, oldObj) {
        if( $scope.departmentTree && angular.isObject($scope.departmentTree.currentNode) ) {
            $scope.selectedDepartment = angular.copy($scope.departmentTree.currentNode);
            $scope.editForm = false;
            $scope.newForm = false;
        }
    }, false);

    $scope.$watch( 'selectedDepartment', function (newObj, oldObj) {
        if ($scope.selectedDepartment.label != 'None' && $scope.work_types && $scope.currencies) {
            $scope.detailReady = 'enabled';
        } else if ($scope.selectedDepartment.label == 'None') {
            $scope.detailReady = 'disabled';
        }
    });

    $scope.$watch( 'newForm', function (newObj, oldObj) {
        if (newObj == true) {
            if (angular.element('#collapseDepartment' + $scope.client.id).hasClass('in')) {
                $('#collapseDepartment' + $scope.client.id).collapse('hide');
            }
        } else if (oldObj == true && newObj == false) {
            if (angular.element('#collapseNewDepartment' + $scope.client.id).hasClass('in')) {
                $('#collapseNewDepartment' + $scope.client.id).collapse('hide');
            }
        }
    })
}]);