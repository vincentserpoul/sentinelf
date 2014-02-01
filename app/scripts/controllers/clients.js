'use strict';

sentinelfApp.controller('ClientsCtrl', ['$scope', 'crud', 'clientsFactory', 'clientDepartmentsFactory', 'modelIsoLabelsFactory', 'modelStaticLabelsFactory',
    function($scope, crud, clientsFactory, clientDepartmentsFactory, modelIsoLabelsFactory, modelStaticLabelsFactory) {

        /* Regroup init of the page in one single function */
        function init() {
            clientsFactory.get(function (data) {
                $scope.clients = data.clients;
            });

            clientDepartmentsFactory.get(function (data) {
                $scope.clientDepartments = data.ClientDepartments;
            });

            $scope.viewTemplate = 'views/clients/clientView.html';
            $scope.editTemplate = 'views/clients/clientEdit.html';
            $scope.clientTemplate = $scope.viewTemplate;

            modelStaticLabelsFactory.get({model:'contact'}, function (data) {
                $scope.titles = data.labels.title;
                $scope.sexes = data.labels.sex;
            });

        }

        init();

        var obj = 'client';
        var preselectedValues = {
            'name':'Client\'s Name',
            'address':'5 jalan bukit merah',
            'city': 'Singapore',
            'postcode' : '159960',
            'country_code':'SGP',
            'phone_number':'+6599999999'};


        $scope.loadCountries = function () {
            /* Get the labels necessary for the list of countries not to be only codes */
            modelIsoLabelsFactory.get({model:'country'}, function (data){
                $scope.countries = data['labels']['country'];
            });
        };

        $scope.loadDepartmentLabels = function () {
            $scope.departmentsStaticLabelsResource = modelStaticLabelsFactory.get({model:'department'});
            $scope.currencyIsoLabelsResource = modelIsoLabelsFactory.get({model:'currency'});
        };

        $scope.newClient = function () {// preselected values for new client
            crud.new($scope, obj, preselectedValues, $scope.loadCountries);
        };

        $scope.saveNewClient = function () {
            crud.create($scope, obj, true);
        };

        $scope.cancelNewClient = function () {
            crud.cancelNew($scope);
        };
    }
]);

sentinelfApp.controller('ClientCtrl', ['$scope', 'crud', 'clientDepartmentsFactory', 'clientContactsFactory',
    function($scope, crud, clientDepartmentsFactory, clientContactsFactory){

        $scope.init = false;
        $scope.editForm = false;

        var obj = 'client';

        $scope.editClient = function () {
            crud.edit($scope, obj, $scope.loadCountries);
        };

        $scope.saveClient = function () {
            crud.save($scope, obj);
        };

        $scope.cancelEditClient = function () {
            crud.cancelEdit($scope, obj);
        };

        /* Delete employee button for each employee */
        $scope.deleteClient = function () {
            crud.delete($scope, obj, 'name', true);
        };

        $scope.loadDepartments = function () {
            if (!$scope.clientDepartmentsTemplate){
                $scope.clientDepartmentsTemplate = 'views/clients/departments/departmentsList.html';
            }
            $scope.openDepartments = !$scope.openDepartments;
        };

        $scope.loadContacts = function () {
            if (!$scope.clientContacts) {
                /* Initialize the list of contacts */
                clientContactsFactory.get({client_id: $scope.client.id}, function (data) {
                    $scope.clientContacts = data.ClientContacts;
                });
            }
            if (!$scope.clientContactsTemplate){
                $scope.clientContactsTemplate = 'views/clients/contacts/contactsList.html';
            }
            $scope.openContacts = !$scope.openContacts;
        };
    }
]);
