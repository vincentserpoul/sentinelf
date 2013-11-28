'use strict';

sentinelfApp.controller('DepartmentsCtrl', ['$scope', 'formService', 'AlertService', 'departmentsFactory', 'modelStaticLabelsFactory', function($scope, formService, AlertService, departmentsFactory, modelStaticLabelsFactory) {

    init();

    /* Regroup init of the page in one single function */
    function init() {
        departmentsFactory.get({employer_id : $scope.employer.id}, function(data){
            $scope.departments = data['EmployerDepartments'];
            /* Get the labels necessary for the list not to be only numbers */
            modelStaticLabelsFactory.get({model:'department'}, function(data){
                $scope.departmentStaticLabels = data['labels'];
            }); 
        });

        $scope.selectedDepartment = {'label': 'None'};
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
            $scope.selectedDepartment = $scope.departmentTree.currentNode;
        }
    }, false);

}]);

/*
/* controller for adding a new department or editing an department
*/
sentinelfApp.controller('DepartmentEditCtrl', ['$scope', '$modalInstance', 'departmentsFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', 'selectedDepartment', 'formService', function($scope, modalInstance, departmentsFactory, modelStaticLabelsFactory, modelIsoLabelsFactory, selectedDepartment, formService){
    // Prefill default value or edited customer
    if(selectedDepartment.action === 'edit'){ 
        $scope.formDepartment = selectedDepartment.selectedDepartment;
    } else {        
    // Prefill the form with default values
        $scope.formDepartment = {
                                "employer_id": selectedDepartment.employer_id,
                                "label":"department name",
                                "description":"department description",
                                "work_type_id": 1,    
                                "employee_hourly_rate": 9,
                                "employee_hourly_rate_currency_code": "SGD",
                                "employer_hourly_rate": 9,
                                "employer_hourly_rate_currency_code": "SGD",
        };
        $scope.formDepartment.parent_id = selectedDepartment.selectedDepartment ? selectedDepartment.selectedDepartment.id : null;  
   }

    modelStaticLabelsFactory.get({model:'department'}, function(data){

        // Init title select and preselect the right value
        $scope.departmentWorkTypeList = data['labels']['work_type'];
        // defaulting the selected value
        $scope.formDepartment.work_type = formService.findObjectById($scope.departmentWorkTypeList, $scope.formDepartment.work_type_id); 
    });

    modelIsoLabelsFactory.get({model:'currency'}, function(data){

        // Init title select and preselect the right value
        $scope.departmentCurrencyList = data['labels']['currency'];
        // defaulting the selected value
        $scope.formDepartment.employee_hourly_rate_currency = formService.findObjectByCode($scope.departmentCurrencyList, $scope.formDepartment.employee_hourly_rate_currency_code); 
        $scope.formDepartment.employer_hourly_rate_currency = formService.findObjectByCode($scope.departmentCurrencyList, $scope.formDepartment.employer_hourly_rate_currency_code); 

    });

    $scope.saveDialog = function(department){
        // create the "id values" from the contact contained in the retrieved form
        $scope.formDepartment.work_type_id = $scope.formDepartment.work_type.id;
        console.log($scope.formDepartment.employee_hourly_rate_currency.code);
        $scope.formDepartment.employee_hourly_rate_currency_code = $scope.formDepartment.employee_hourly_rate_currency.code;
        $scope.formDepartment.employer_hourly_rate_currency_code = $scope.formDepartment.employer_hourly_rate_currency.code;

        if($scope.formDepartment.id){
            /* Call the factory to update the new department in db */
            departmentsFactory.update($scope.formDepartment, 
                function(data){
                    modalInstance.close(data);
                }
            );
        } else {
            /* Call the factory to update the department in db */
            departmentsFactory.save($scope.formDepartment,
                function(data){
                    modalInstance.close(data);
                }
            );
        }
    }

    $scope.closeDialog = function(){
        modalInstance.close();
    }

}])