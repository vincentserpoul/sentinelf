'use strict';

sentinelfApp.controller('ClientsCtrl', ['$scope', 'formService', 'AlertService', 'clientsFactory', 'clientsLazyloadFactory', 'modelIsoLabelsFactory', 'modelStaticLabelsFactory', function($scope, formService, AlertService, clientsFactory, clientsLazyloadFactory, modelIsoLabelsFactory, modelStaticLabelsFactory) {

    init();

    /* Regroup init of the page in one single function */
	function init() {

        /* Initialize the list of clients */
        /* Load the progressive service to load list of employees */
        $scope.clientsLazyloadFactory = new clientsLazyloadFactory();
        /* First launch */
        $scope.clientsLazyloadFactory.loadMore();
        /* Get the labels necessary for the list of countries not to be only codes */
        $scope.countryIsoLabelsResource = modelIsoLabelsFactory.get({model:'country'});
        $scope.departmentsStaticLabelsResource = modelStaticLabelsFactory.get({model:'department'});
        $scope.currencyIsoLabelsResource = modelIsoLabelsFactory.get({model:'currency'});
        $scope.contactStaticLabelsResource = modelStaticLabelsFactory.get({model:'contact'});

        $scope.newForm = true;
    };

    $scope.newClient = function () {// preselected values for new client
        $scope.createdClient = {
            "name":"Client's Name",
            "address":"5 jalan bukit merah",
            "city": "Singapore",
            "postcode" : "159960",
            "country_code":"SGP",
            "phone_number":"+6599999999",
            "fax_number":"+6599999999"};
        $('#collapseNewClient').collapse('show');
    }

    $scope.saveNewClient = function () {
        // get code from model
        $scope.createdClient.country_code = $scope.createdClient.country['code'];
        /* Call the factory to update the new client in db */
        clientsFactory.save($scope.createdClient,
            function (data) {
                if (data) {
                    $scope.clientsLazyloadFactory.clients.unshift(data['client']);
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }
            }, function (error) {
                if (error['data']) AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
            }
        );
        $('#collapseNewClient').collapse('hide');
    }

    $scope.cancelNewClient = function () {
        $('#collapseNewClient').collapse('hide');
    }
}]);

sentinelfApp.controller('ClientCtrl', ['$scope', 'formService', 'clientsFactory', 'departmentsLazyloadFactory', 'contactsLazyloadFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', 'AlertService', function($scope, formService, clientsFactory, departmentsLazyloadFactory, contactsLazyloadFactory, modelStaticLabelsFactory, modelIsoLabelsFactory, AlertService){

    $scope.init = false;
    $scope.editForm = false;

    $scope.editClient = function () {
        $scope.savClient = {};
        formService.copyProps($scope.client, $scope.savClient);
        // Activate the edit
        $scope.editForm = true;
    }

    $scope.saveClient = function () {
        // get code from model
        $scope.client.country_code = $scope.client.country['code'];
        /* Call the factory to update the new client in db */
        clientsFactory.update($scope.client,
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

    $scope.cancelEditClient = function () {
        // Reset the data to what it was before the edit
        formService.copyProps($scope.savClient, $scope.client);
        // Deactivate the edit
        $scope.editForm = false;
    };

    /* Delete employee button for each employee */
    $scope.deleteClient = function () {

        var modalInstance = formService.popup('client', $scope.client.name);

        modalInstance.result.then(function(){
            clientsFactory.delete({clientId:$scope.client.id},
                function (data) {
                    $scope.clientsLazyloadFactory.clients.splice(formService.findInArray($scope.clientsLazyloadFactory.clients, $scope.client.id), 1);
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
            $scope.departmentsLazyloadFactory = new departmentsLazyloadFactory($scope.client.id);
            /* First launch */
            $scope.departmentsLazyloadFactory.loadMore();
        }
        if (!$scope.departmentsTemplate)
            $scope.departmentsTemplate = 'views/clients/departments/departmentsList.html';
        $scope.openDepartments = !$scope.openDepartments;
    }

    $scope.loadContacts = function () {
        if (!$scope.contactsLazyloadFactory) {
            /* Initialize the list of departments */
            /* Load the progressive service to load list of departments */
            $scope.contactsLazyloadFactory = new contactsLazyloadFactory($scope.client.id);
            /* First launch */
            $scope.contactsLazyloadFactory.loadMore();
        }
        if (!$scope.contactsTemplate)
            $scope.contactsTemplate = 'views/clients/contacts/contactsList.html';
        $scope.openContacts = !$scope.openContacts;
    }
}])
