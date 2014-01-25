'use strict';

sentinelfApp.controller('ClientsCtrl', ['$scope', 'crud', 'clientFactory', 'modelIsoLabelsFactory', 'modelStaticLabelsFactory', function($scope, crud, clientFactory, modelIsoLabelsFactory, modelStaticLabelsFactory) {

    init();

    /* Regroup init of the page in one single function */
	function init() {
        clientFactory.get(function (data) {
            $scope.clients = data['clients'];
        })

        $scope.viewTemplate = 'views/clients/clientView.html';
        $scope.editTemplate = 'views/clients/clientEdit.html';
        $scope.clientTemplate = $scope.viewTemplate;

        modelStaticLabelsFactory.get({model:'contact'}, function (data) {
            $scope.titles = data['labels']['title'];
            $scope.sexes = data['labels']['sex'];
        })
    };

    var obj = 'client';
    var preselectedValues = {
        "name":"Client's Name",
        "address":"5 jalan bukit merah",
        "city": "Singapore",
        "postcode" : "159960",
        "country_code":"SGP",
        "phone_number":"+6599999999"};

    $scope.loadCountries = function () {
        /* Get the labels necessary for the list of countries not to be only codes */
        modelIsoLabelsFactory.get({model:'country'}, function (data){
            $scope.countries = data['labels']['country'];
        });
    }

    $scope.loadDepartmentLabels = function () {
        $scope.departmentsStaticLabelsResource = modelStaticLabelsFactory.get({model:'department'});
        $scope.currencyIsoLabelsResource = modelIsoLabelsFactory.get({model:'currency'});
    }

    $scope.newClient = function () {// preselected values for new client
        crud.new($scope, obj, preselectedValues, $scope.loadCountries);
    }

    $scope.saveNewClient = function () {
        crud.create($scope, obj, true);
    }

    $scope.cancelNewClient = function () {
        crud.cancelNew($scope);
    }
}]);

sentinelfApp.controller('ClientCtrl', ['$scope', 'crud', 'departmentFactory', 'contactFactory', function($scope, crud, departmentFactory, contactFactory){

    $scope.init = false;
    $scope.editForm = false;

    var obj = 'client';

    $scope.editClient = function () {
        crud.edit($scope, obj, $scope.loadCountries);
    }

    $scope.saveClient = function () {
        crud.save($scope, obj);
    };

    $scope.cancelEditClient = function () {
        crud.cancelEdit($scope, obj);
    };

    /* Delete employee button for each employee */
    $scope.deleteClient = function () {
        crud.delete($scope, obj, 'name', true);
    }

    $scope.loadDepartments = function () {
        if (!$scope.departments) {
            /* Initialize the list of departments */
            departmentFactory.get(function (data) {
                $scope.departments = data['ClientDepartments'];
            })
        }
        if (!$scope.departmentsTemplate)
            $scope.departmentsTemplate = 'views/clients/departments/departmentsList.html';
        $scope.openDepartments = !$scope.openDepartments;
    }

    $scope.loadContacts = function () {
        if (!$scope.contacts) {
            /* Initialize the list of contacts */
            contactFactory.get({client_id: $scope.client.id}, function (data) {
                $scope.contacts = data['ClientContacts'];
            })
        }
        if (!$scope.contactsTemplate)
            $scope.contactsTemplate = 'views/clients/contacts/contactsList.html';
        $scope.openContacts = !$scope.openContacts;
    }
}])
