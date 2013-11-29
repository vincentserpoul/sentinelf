'use strict';

sentinelfApp.controller('EmployersCtrl', ['$scope', 'formService', 'AlertService', 'employersFactory', 'modelIsoLabelsFactory', function($scope, formService, AlertService, employersFactory, modelIsoLabelsFactory) {

    init();

    /* Regroup init of the page in one single function */
	function init() {

        /* Initialize the list of employers */
        employersFactory.get(function(data){
            $scope.employers = data['employers'];
            // get model iso labels for country of employers
            modelIsoLabelsFactory.get({model:'country'}, function(data){
                $scope.isoLabels = data['labels'];
                for (var i in $scope.employers) {
                    $scope.employers[i].country = formService.findObjectByCode($scope.isoLabels['country'], $scope.employers[i].country_code);
                }
            });
        });

        $scope.newForm = true;
    };

    $scope.newEmployer = function () {
        // preselected values for new employer
        $scope.createdEmployer = {
            "name":"Employer's Name",
            "address":"5 jalan bukit merah",
            "city": "Singapore",
            "postcode" : "159960",
            "country_code":"SGP",
            "phone_number":"+6599999999",
            "fax_number":"+6599999999"};
        $scope.createdEmployer.country = formService.findObjectByCode($scope.isoLabels['country'], $scope.createdEmployer.country_code);
        $('#collapseNewEmployer').collapse('show');
    }

    $scope.saveEmployer = function () {
        /* Call the factory to update the new employer in db */
        //update codes
        $scope.createdEmployer.country_code = $scope.createdEmployer.country['code'];
        employersFactory.save($scope.createdEmployer,
            function (data) {
                if (data) {
                    data['employer'].country = formService.findObjectByCode($scope.isoLabels['country'], data['employer'].country_code);
                    $scope.employers.push(data['employer']);
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);     
                }
                $('#collapseNewEmployer').collapse('hide');
            }, function (error) {
                if (error['data'])
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false); 
                $('#collapseNewEmployer').collapse('hide');
            }
        );
    }

    $scope.closeNewEmployer = function () {
        $('#collapseNewEmployer').collapse('hide');
    }
}]);

sentinelfApp.controller('EmployerCtrl', ['$scope', 'formService', 'employersFactory', 'AlertService', function($scope, formService, employersFactory, AlertService){

    $scope.editEmployer = function () {
        // Save employer in case of cancel, to rollback to previous values
        $scope.savEmployer = angular.copy($scope.employer);
        // shallow copy code
        $scope.savEmployer.country = $scope.employer.country;
        // Activate the edit
        $scope.editForm = true;
    }

    $scope.saveEmployer = function () {
        /* Call the factory to update the new employer in db */
        //update codes
        $scope.employer.country_code = $scope.employer.country['code'];
        employersFactory.update($scope.employer,
            function (data) {
                if (data) {
                    // when success, reset the savEmployer
                    $scope.savEmployer = null;
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true); 
                }
            }, function (error) {
                if (error['data'])
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false); 
            }
        );
        $scope.editForm = false;   
    };

    $scope.cancelEditEmployer = function () {
        // Reset the data to what it was before the edit
        $scope.employer = $scope.savEmployer;
        // Deactivate the edit
        $scope.editForm = false;
    };

    /* Delete employee button for each employee */
    $scope.deleteEmployer = function () {

        var modalInstance = formService.popup('employer', $scope.employer.name);

        modalInstance.result.then(function(){
            employersFactory.delete({employerId:$scope.employer.id},
                function (data) {
                    $scope.employers.splice(formService.findInArray($scope.employers, $scope.employer.id), 1);
                    if (data)
                        AlertService.show({ "message": data['message'], "type": 'alert-success' }, true); 
                }, function (error) { 
                    if (error['data'])
                        AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false); 
                }
            );
        });
    }

}])