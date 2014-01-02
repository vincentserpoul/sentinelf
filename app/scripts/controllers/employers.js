'use strict';

sentinelfApp.controller('EmployersCtrl', ['$scope', 'formService', 'AlertService', 'employersFactory', 'employersLazyloadFactory', 'modelIsoLabelsFactory', 'modelStaticLabelsFactory', function($scope, formService, AlertService, employersFactory, employersLazyloadFactory, modelIsoLabelsFactory, modelStaticLabelsFactory) {

    init();

    /* Regroup init of the page in one single function */
	function init() {

        /* Initialize the list of employers */
        /* Load the progressive service to load list of employees */
        $scope.employersLazyloadFactory = new employersLazyloadFactory();
        /* First launch */
        $scope.employersLazyloadFactory.loadMore();

        $scope.newForm = true;
    };

    $scope.loadEmployerResource = function () {
        /* Get the labels necessary for the list of countries not to be only codes */
        $scope.countryListResource = modelIsoLabelsFactory.get({model:'country'});
        return $scope.countryListResource;
    }

    $scope.loadDepartmentsResource = function () {
        $scope.departmentsStaticLabelsResource = modelStaticLabelsFactory.get({model:'department'});
        $scope.currencyIsoLabelsResource = modelIsoLabelsFactory.get({model:'currency'});
        return $scope.currencyIsoLabelsResource;
    }

    $scope.loadContactsResource = function () {
        $scope.contactStaticLabelsResource = modelStaticLabelsFactory.get({model:'contact'});
    }

    // preselected values for new employer
    $scope.createdEmployer = {
        "name":"Employer's Name",
        "address":"5 jalan bukit merah",
        "city": "Singapore",
        "postcode" : "159960",
        "country_code":"SGP",
        "phone_number":"+6599999999",
        "fax_number":"+6599999999"};
    var setNewValues = false;

    function initEmployerValues () {
        if (!setNewValues) {
            formService.initValues($scope.createdEmployer);
            setNewValues = true;
        }
        $('#collapseNewEmployer').collapse('show');
    }

    $scope.newEmployer = function () {
        if (!$scope.countryListResource) {
            $scope.loadEmployerResource().$promise.then(function(){
                initEmployerValues();
            })
        } else initEmployerValues();
    }

    $scope.saveNewEmployer = function () {
        // get code from model
        $scope.createdEmployer.country_code = $scope.createdEmployer.country['code'];
        /* Call the factory to update the new employer in db */
        employersFactory.save($scope.createdEmployer,
            function (data) {
                if (data) {
                    $scope.employersLazyloadFactory.employers.unshift(data['employer']);
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

    $scope.init = false;

    function initEditEmployerValues () {
        if (!$scope.init) { 
            $scope.savEmployer = formService.initValues($scope.employer);
            $scope.init = true;
        }
        // Activate the edit
        $scope.editForm = true;
    }

    $scope.editEmployer = function () {
        if (!$scope.countryListResource) {
            $scope.loadEmployerResource().$promise.then(function(){
                initEditEmployerValues();
            })
        } else initEditEmployerValues();
    }

    $scope.saveEmployer = function () {
        // get code from model
        $scope.employer.country_code = $scope.employer.country['code'];
        /* Call the factory to update the new employer in db */
        employersFactory.update($scope.employer,
            function (data) {
                if (data) {
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
        formService.copyProps($scope.savEmployer, $scope.employer);
        // Deactivate the edit
        $scope.editForm = false;
    };

    /* Delete employee button for each employee */
    $scope.deleteEmployer = function () {

        var modalInstance = formService.popup('employer', $scope.employer.name);

        modalInstance.result.then(function(){
            employersFactory.delete({employerId:$scope.employer.id},
                function (data) {
                    $scope.employersLazyloadFactory.employers.splice(formService.findInArray($scope.employersLazyloadFactory.employers, $scope.employer.id), 1);
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
    }

    $scope.loadContacts = function () {
        if (!$scope.contactsLazyloadFactory) {
            /* Initialize the list of departments */
            /* Load the progressive service to load list of departments */
            $scope.contactsLazyloadFactory = new contactsLazyloadFactory($scope.employer.id);
            /* First launch */
            $scope.contactsLazyloadFactory.loadMore();
        }
    }
}])
