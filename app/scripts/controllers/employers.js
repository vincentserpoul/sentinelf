'use strict';

sentinelfApp.controller('EmployersCtrl', ['$scope', 'formService', 'AlertService', 'employersLazyloadFactory', 'modelIsoLabelsFactory', function($scope, formService, AlertService, employersLazyloadFactory, modelIsoLabelsFactory) {

    init();

    /* Regroup init of the page in one single function */
	function init() {

        /* Initialize the list of employers */
        /* Load the progressive service to load list of employees */
        $scope.employersLazyloadFactory = new employersLazyloadFactory();
        /* First launch */
        $scope.employersLazyloadFactory.loadMore();

        /* Get the labels necessary for the list of countries not to be only codes */
        $scope.countryListResource = modelIsoLabelsFactory.get({model:'country'});

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
        $('#collapseNewEmployer').collapse('show');
    }

    $scope.saveNewEmployer = function () {
        // get code from model
        $scope.createdEmployer.country_code = $scope.createdEmployer.country['code'];
        /* Call the factory to update the new employer in db */
        employersFactory.save($scope.createdEmployer,
            function (data) {
                if (data) {
                    $scope.employers.push(data['employer']);
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }
            }, function (error) {
                if (error['data']) AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
            }
        );
        $('#collapseNewEmployer').collapse('hide');
    }

    $scope.cancelNewEmployer = function () {
        $('#collapseNewEmployer').collapse('hide');
    }
}]);

sentinelfApp.controller('EmployerCtrl', ['$scope', 'formService', 'employersFactory', 'departmentsLazyloadFactory', 'contactsLazyloadFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', 'AlertService', function($scope, formService, employersFactory, departmentsLazyloadFactory, contactsLazyloadFactory, modelStaticLabelsFactory, modelIsoLabelsFactory, AlertService){

    $scope.editEmployer = function () {
        // Save employer in case of cancel, to rollback to previous values
        $scope.savEmployer = angular.copy($scope.employer);
        // shallow copy code
        $scope.savEmployer.country = $scope.employer.country;
        // Activate the edit
        $scope.editForm = true;
    }

    $scope.saveEmployer = function () {
        // get code from model
        $scope.employer.country_code = $scope.employer.country['code'];
        /* Call the factory to update the new employer in db */
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

    $scope.loadDepartments = function () {
        if (!$scope.departmentsLazyloadFactory) {
            /* Initialize the list of departments */
            /* Load the progressive service to load list of departments */
            $scope.departmentsLazyloadFactory = new departmentsLazyloadFactory($scope.employer.id);
            /* First launch */
            $scope.departmentsLazyloadFactory.loadMore();
        }

        if (!$scope.departmentsStaticLabelsResource) 
            $scope.departmentsStaticLabelsResource = modelStaticLabelsFactory.get({model:'department'});
        if (!$scope.currencyIsoLabelsResource)
            $scope.currencyIsoLabelsResource = modelIsoLabelsFactory.get({model:'currency'});
    }

    $scope.loadContacts = function () {
        if (!$scope.contactsLazyloadFactory) {
            /* Initialize the list of departments */
            /* Load the progressive service to load list of departments */
            $scope.contactsLazyloadFactory = new contactsLazyloadFactory($scope.employer.id);
            /* First launch */
            $scope.contactsLazyloadFactory.loadMore();
        }

        if (!$scope.contactStaticLabelsResource)
            $scope.contactStaticLabelsResource = modelStaticLabelsFactory.get({model:'contact'});
    }
}])
