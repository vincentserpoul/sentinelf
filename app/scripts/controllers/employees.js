'use strict';

sentinelfApp.controller('EmployeesCtrl', ['$scope', '$dialog', 'employeesFactory', 'modelStaticLabelsFactory', function($scope, $dialog, employeesFactory, modelStaticLabelsFactory) {

    init();

    /* Regroup init of the page in one single function */
    function init() {

        /* Gt the employee list */
        employeesFactory.get(function(data){
            $scope.employees = data['employees'];
        });

        /* Get the labels necessary for the list not to be only numbers */
        modelStaticLabelsFactory.get({model:'employee'}, function(data){
            $scope.employeeStaticLabels = data['labels'];
        });
    }

    /* Edit employee button for each employee */
    $scope.editEmployee = function(){

        $scope.originalEmployee = this.employee;

        var opts = {
                backdrop: false,
                keyboard: true,
                backdropClick: false,
                templateUrl:  'views/employees/employeeForm.html', // OR: templateUrl: 'path/to/view.html',
                controller: 'EmployeeEditCtrl',
                resolve: {
                    selectedEmployee: function () { return angular.copy($scope.originalEmployee); }
                }
        };

        var d = $dialog.dialog(opts);

        d.open().then(
            function(data){

                /* If it is successful */
                if(data && data['error'] == false){

                    /* If employee is returned by the dialog and it is an insert */
                    if(data && data['employee'] && data['action'] == 'insert'){

                        /* Add the employee on top of he list */
                        $scope.employees.unshift(data['employee']);

                    } else if(data && data['employee'] && data['action'] == 'update'){

                        /* Copy back the modified data to the list of employee */
                        /* Note that we can't do a simple "=" between object, angularjs will not append it. We need to use angalar.copy */
                        angular.copy(data['employee'], $scope.originalEmployee);

                    }

                } else {
                    console.log(data['error']);
                    /* display error */
                }

            }
        );
    };

    /* Delete employee button for each employee */
    $scope.deleteEmployee = function(){

        $scope.originalEmployee = this.employee;

        var name = "Delete employee";
        var msg = "Are you sure you want to delete employee "
                    + $scope.originalEmployee.last_name + " "
                    + $scope.originalEmployee.first_name + " "
                    + "(" + $scope.originalEmployee.mobile_phone_number + ")?";

        var btns = [{result: 'cancel', label: 'Cancel'}, {result: 'confirm', label: 'Confirm', cssClass: 'btn-primary'}];

        $dialog.messageBox(name, msg, btns)
        .open()
        .then(function(result){
            if(result == 'confirm'){
                employeesFactory.delete({employeeId:$scope.originalEmployee.id},
                    function(data){
                        if(data && data['error'] == false){
                            $scope.originalEmployee.delete();
                        } else {
                            console.log(data['error']);
                        }

                    }
                );
            }
        });
    }

}]);

sentinelfApp.controller('EmployeeEditCtrl', ['$scope', '$filter', 'dialog', 'employeesFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', 'selectedEmployee', function($scope, $filter, dialog, employeesFactory, modelStaticLabelsFactory, modelIsoLabelsFactory, selectedEmployee){

    // Prefill the form with edited customer
    if(selectedEmployee){
        $scope.formEmployee = selectedEmployee;
    } else {
    // Prefill the form with default values
        $scope.formEmployee = {
                                "title_id":1,
                                "first_name":"Gokul",
                                "last_name":"Jeyo",
                                "sex_id": 2,
                                "country_code" : "IND",
                                "date_of_birth":"1980-01-01",
                                "mobile_phone_number":"+6599999999",
                                "school":"NUS",
                                "join_date":"2012-02-03 22:27:33",
                                "race_id": 3,
                                "status_id": 1,
                                "work_pass_type": 1
         };
    }

    $scope.formEmployee.date_of_birth_dateformat = new Date($scope.formEmployee.date_of_birth);

    modelStaticLabelsFactory.get({model:'employee'}, function(data){

        /* On callback of the service, fill the big static select */

        /* Function to find the object corresponding to the static labels for a given id */
        function findObjectById(listObject, idObject){
            for(var i in listObject){
                if(listObject[i].id == idObject) {return listObject[i]};
            }
            return listObject[0];
        }

        // Init title select and preselect the right value
        $scope.employeeTitleList = data['labels']['title'];
        // defaulting the selected value
        $scope.formEmployee.title = findObjectById($scope.employeeTitleList, $scope.formEmployee.title_id);

        // Init title select and preselect the right value
        $scope.employeeSexList = data['labels']['sex'];
        // defaulting the selected value
        $scope.formEmployee.sex = findObjectById($scope.employeeSexList, $scope.formEmployee.sex_id);

        // Init title select and preselect the right value
        $scope.employeeRaceList = data['labels']['race'];
        // defaulting the selected value
        $scope.formEmployee.race = findObjectById($scope.employeeRaceList, $scope.formEmployee.race_id);

        // Init employee identity doc types select and preselect the right value
        $scope.employeeIdentityDocTypeList = data['labels']['identity_doc_type'];
        // defaulting the selected value
        $scope.formEmployee.employee_identity_doc[0].identity_doc_type = findObjectById($scope.employeeIdentityDocTypeList, $scope.formEmployee.employee_identity_doc[0].identity_doc_type_id);

        // Init employee identity doc types select and preselect the right value
        $scope.employeeDocTypeList = data['labels']['doc_type'];
        // defaulting the selected value
        $scope.formEmployee.employee_doc[0].doc_type = findObjectById($scope.employeeDocTypeList, $scope.formEmployee.employee_doc[0].doc_type_id);

        // Init title select and preselect the right value
        $scope.employeeStatusList = data['labels']['status'];
        // defaulting the selected value
        $scope.formEmployee.status = findObjectById($scope.employeeStatusList, $scope.formEmployee.status_id);

        // Init title select and preselect the right value
        $scope.employeeWorkPassTypeList = data['labels']['work_pass_type'];
        // defaulting the selected value
        $scope.formEmployee.work_pass_type = findObjectById($scope.employeeWorkPassTypeList, $scope.formEmployee.work_pass_type_id);

        // Init document types
        $scope.identityDocType = data['labels']['identity_doc_type'];

    });

    modelIsoLabelsFactory.get({model:'country'}, function(data){

        /* For some static label, the iso code is the primary key. So with the key given in the employee table, we need to find the label */
        function findObjectByCode(listObject, codeObject){
            for(var i in listObject){
                if(listObject[i].code == codeObject) {return listObject[i]};
            }
            return listObject[0];
        }

        // Init title select and preselect the right value
        $scope.employeeCountryList = data['labels']['country'];
        // defaulting the selected value
        $scope.formEmployee.country = findObjectByCode($scope.employeeCountryList, $scope.formEmployee.country_code);

    });

    $scope.saveDialog = function(){

        // create the "id values" from the employee contained in the retrieved form
        $scope.formEmployee.title_id = $scope.formEmployee.title.id;
        $scope.formEmployee.sex_id = $scope.formEmployee.sex.id;
        $scope.formEmployee.country_code = $scope.formEmployee.country.code;
        $scope.formEmployee.race_id = $scope.formEmployee.race.id;
        $scope.formEmployee.status_id = $scope.formEmployee.status.id;
        $scope.formEmployee.work_pass_type_id = $scope.formEmployee.work_pass_type.id;
        $scope.formEmployee.employee_identity_doc[0].identity_doc_type_id = $scope.formEmployee.employee_identity_doc[0].identity_doc_type.id;
        $scope.formEmployee.employee_doc[0].doc_type_id = $scope.formEmployee.employee_doc[0].doc_type.id;
        $scope.formEmployee.date_of_birth = $filter('date')($scope.formEmployee.date_of_birth_dateformat, 'yyyy/MM/dd');



        if($scope.formEmployee.id){
            /* Call the factory to update the new employee in db */
            employeesFactory.update($scope.formEmployee,
                function(data){
                    dialog.close(data);
                }
            );
        } else {
            /* Call the factory to create the new employee in db */
            employeesFactory.save($scope.formEmployee,
                function(data){
                    dialog.close(data);
                }
            );
        }

    };

    $scope.closeDialog = function(){
        dialog.close();
    }

}]);
