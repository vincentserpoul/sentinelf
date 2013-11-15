'use strict';

sentinelfApp.controller('DepartmentsCtrl', ['$scope', '$modal', 'departmentsFactory', 'modelStaticLabelsFactory', function($scope, $modal, departmentsFactory, modelStaticLabelsFactory) {

    init();

    /* Regroup init of the page in one single function */
    function init() {
        /* Initialize the list of departments */
        $scope.employer = $scope.$parent.employer;
        
        departmentsFactory.get({employer_id : $scope.employer.id}, function(data){
            $scope.departments = data['EmployerDepartments'];
        });

        /* Get the labels necessary for the list not to be only numbers */
        modelStaticLabelsFactory.get({model:'department'}, function(data){
            $scope.departmentStaticLabels = data['labels'];
        });
    };

    /*show departments */

    $scope.showDepartments = function(){
        var item = this.item;
        item.selected = this.$selected;
    };

    /**
    /* the function is called when users want to add a new department or edit an department
    /* a modal will pop up with a table for users to fill in the information
    */
    $scope.editDepartment = function(action){

        $scope.originalDepartment = this.item;
        
        var opts = {
            backdrop: false,
            keyboard: true,
            backdropClick: false,
            templateUrl:  'views/employers/departments/departmentForm.html', // OR: templateUrl: 'path/to/view.html',
            controller: 'DepartmentEditCtrl',
            resolve: {
                selectedDepartment: function () { 
                    return {
                        'action': action, 
                        'selectedDepartment': angular.copy($scope.originalDepartment), 
                        'employer_id': $scope.employer.id
                    }; 
                }
            }
        };

        var modalInstance = $modal.open(opts);

        modalInstance.result.then(
            function(data){

                /* If it is successful */
                if(data && data['error'] == false){

                    /* If department is returned by the modal and it is an insert */
                    if(data && data['EmployerDepartment'] && data['action'] === 'insert'){

                        /* Add the department on top of he list */
                        if($scope.originalDepartment){
                            if(!$scope.originalDepartment.children)                        
                                $scope.originalDepartment.children = new Array();
                            $scope.originalDepartment.children.unshift(data['EmployerDepartment']);
                        }
                        else $scope.departments.unshift(data['EmployerDepartment']);

                    } else if(data && data['EmployerDepartment'] && data['action'] === 'update'){

                        /* Copy back the modified data to the list of department */
                        /* Note that we can't do a simple "=" between object, angularjs will not append it. We need to use angalar.copy */
                        angular.copy(data['EmployerDepartment'], $scope.originalDepartment);

                    }

                } 
                
            }
        );
    };

    /* Delete department button for each department */
    $scope.deleteDepartment = function(){

        $scope.originalDepartment = this.item;

        var name = "Delete department";
        var msg = "Are you sure you want to delete department "
                    + $scope.originalDepartment.label + "?";

        var btns = [{result: 'cancel', label: 'Cancel'}, {result: 'confirm', label: 'Confirm', cssClass: 'btn-primary'}];

        $modal.messageBox(name, msg, btns)
        .open()
        .then(function(result){
            if(result == 'confirm'){
                departmentsFactory.delete({departmentId:$scope.originalDepartment.id},
                    function(data){
                        if(data && data['error'] == false){
                            $scope.departments = data['EmployerDepartments'];
                        } else {
                            console.log(data['error']);
                        }
                    }
                );
            }
        });
    }

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