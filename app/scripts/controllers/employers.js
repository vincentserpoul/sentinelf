'use strict';

sentinelfApp.controller('EmployersCtrl', ['$scope', 'employersFactory', 'modelIsoLabelsFactory', function($scope, employersFactory, modelIsoLabelsFactory) {

    init();

    /* Regroup init of the page in one single function */
	function init() {

        /* Initialize the list of employers */
        employersFactory.get(function(data){
            $scope.employers = data['employers'];
        });

        modelIsoLabelsFactory.get({model:'country'}, function(data){
            $scope.isoLabels = data['labels'];
        });
    };
}]);

sentinelfApp.controller('EmployerCtrl', ['$scope', 'formService', 'employersFactory', function($scope, formService, employersFactory){
    /**
    /* the function is called when users want to add a new employer or edit an employer
    /* a modal will pop up with a table for users to fill in the information
    */
    $scope.editor = 'disabled';

    $scope.formEmployer = angular.copy($scope.employer);

    $scope.editEmployer = function(choice){
        if(choice == null)
            $scope.editor = 'enabled';

        else {
            $scope.editor = 'disabled';
            if (choice == 'save') {
                /* Call the factory to update the new employer in db */
                employersFactory.update($scope.formEmployer,
                    function(data){
                        $scope.employer = data['employer'];
                        $scope.formEmployer = angular.copy($scope.employer);
                    }
                );
            } else {
                $scope.formEmployer = angular.copy($scope.employer);
            }
        }
    };

    /* Delete employee button for each employee */
    $scope.deleteEmployer = function(){

        var modalInstance = formService.popup('employer', $scope.employer.name);

        modalInstance.result.then(function(){
            employersFactory.delete({employerId:$scope.employer.id},
                function(data){
                    if(data && data['error'] == false){
                        $scope.employer.delete();
                    } else {
                        console.log(data['error']);
                    }

                }
            );
        });
    }

    $scope.saveEmployer = function(){
        console.log($scope.employer);
    }
}])

/*
/* controller for adding a new employer or editing an employer
*/
sentinelfApp.controller('EmployerEditCtrl', ['$scope', '$modalInstance', 'employersFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', 'selectedEmployer', 'formService', '$http', function($scope, modalInstance, employersFactory, modelStaticLabelsFactory, modelIsoLabelsFactory, selectedEmployer, formService, $http){
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
                    modalInstance.close(data);
                }
            );
        } else {
            /* Call the factory to create the new employee in db */
            employersFactory.save($scope.formEmployer,
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
