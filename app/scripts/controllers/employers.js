'use strict';

sentinelfApp.controller('EmployersCtrl', ['$scope', '$dialog', 'employersFactory', 'modelStaticLabelsFactory', function($scope, $dialog, employersFactory, modelStaticLabelsFactory) {

    init();

    /* Regroup init of the page in one single function */
	function init() {

        /**
        /* initialize the collapse values for departments and contacts contents
        /* "true" means that the 2 contents will be hidden at the beginning
        */
        $scope.dListCollapsed = true;
        $scope.cListCollapsed = true;

        /* Initialize the list of employers */
        employersFactory.get(function(data){
            $scope.employers = data['employers'];
        });
    };

    /**
    /* the function is called when users want to add a new employer or edit an employer
    /* a dialog will pop up with a table for users to fill in the information
    */
    $scope.editEmployer = function(){

        $scope.originalEmployer = this.employer;
        
        var opts = {
            backdrop: false,
            keyboard: true,
            backdropClick: false,
            templateUrl:  'views/employers/employerForm.html', // OR: templateUrl: 'path/to/view.html',
            controller: 'EmployerEditCtrl',
            resolve: {
                selectedEmployer: function () { return angular.copy($scope.originalEmployer); }
            }
        };

        var d = $dialog.dialog(opts);

        d.open().then(
            function(data){

                /* If it is successful */
                if(data && data['error'] == false){

                    /* If employee is returned by the dialog and it is an insert */
                    if(data && data['employer'] && data['action'] == 'insert'){

                        /* Add the employee on top of he list */
                        $scope.employers.unshift(data['employer']);

                    } else if(data && data['employer'] && data['action'] == 'update'){

                        /* Copy back the modified data to the list of employee */
                        /* Note that we can't do a simple "=" between object, angularjs will not append it. We need to use angalar.copy */
                        angular.copy(data['employer'], $scope.originalEmployer);

                    }

                } else {
                    console.log(data['error']);
                    /* display error */
                }
                
            }
        );
    };

    /* Delete employee button for each employee */
    $scope.deleteEmployer = function(){

        $scope.originalEmployer = this.employer;

        var name = "Delete employer";
        var msg = "Are you sure you want to delete employer "
                    + $scope.originalEmployer.name + "?";

        var btns = [{result: 'cancel', label: 'Cancel'}, {result: 'confirm', label: 'Confirm', cssClass: 'btn-primary'}];

        $dialog.messageBox(name, msg, btns)
        .open()
        .then(function(result){
            if(result == 'confirm'){
                employersFactory.delete({employerId:$scope.originalEmployer.id},
                    function(data){
                        if(data && data['error'] == false){
                            $scope.originalEmployer.delete();
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
/* controller for adding a new employer or editing an employer
*/
sentinelfApp.controller('EmployerEditCtrl', ['$scope', 'dialog', 'employersFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', 'selectedEmployer', 'formService', '$http', function($scope, dialog, employersFactory, modelStaticLabelsFactory, modelIsoLabelsFactory, selectedEmployer, formService, $http){
    // Prefill default value or edited customer
    if(selectedEmployer){ 
        $scope.formEmployer = selectedEmployer;
    } else {
    // Prefill the form with default values
        $scope.formEmployer = {
                                "name":"employer name",
                                "address":"5 jalan bukit merah",
                                "city": "Singapore",
                                "postcode" : "159960",
                                "country_code":"SGP",
                                "phone_number":"+6599999999",
                                "fax_number":"+6599999999",
         };
   }

    modelIsoLabelsFactory.get({model:'country'}, function(data){

        /* For some static label, the iso code is the primary key. So with the key given in the employee table, we need to find the label */
        function findObjectByCode(listObject, codeObject){
            for(var i in listObject){
                if(listObject[i].code == codeObject) {return listObject[i]};
            }
            return listObject[0];
        }

        // Init title select and preselect the right value
        $scope.employerCountryList = data['labels']['country'];
        // defaulting the selected value
        $scope.formEmployer.country = findObjectByCode($scope.employerCountryList, $scope.formEmployer.country_code); 

    });


    $scope.saveDialog = function(employer){

        // reset the "id values" from the objects contained in the retrieved form
        $scope.formEmployer.country_code = $scope.formEmployer.country.code;

        if($scope.formEmployer.id){
            /* Call the factory to update the new employee in db */
            employersFactory.update($scope.formEmployer, 
                function(data){
                    dialog.close(data);
                }
            );
        } else {
            /* Call the factory to create the new employee in db */
            employersFactory.save($scope.formEmployer,
                function(data){
                    dialog.close(data);
                }
            );
        }
    }

    $scope.closeDialog = function(){
        dialog.close();
    }

}])