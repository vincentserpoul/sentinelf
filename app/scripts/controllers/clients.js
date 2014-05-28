'use strict';

sentinelfApp.controller('ClientsCtrl', ['$scope', 'clientsFactory', 'clientDepartmentsFactory', 'modelIsoLabelsFactory', 'modelStaticLabelsFactory',
    function($scope,clientsFactory, clientDepartmentsFactory, modelIsoLabelsFactory, modelStaticLabelsFactory) {

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

            /* Get the labels necessary for the list of countries not to be only codes */
            $scope.countryListResource = modelIsoLabelsFactory.get({model:'country'}, function(data){
                $scope.countries = data.labels.country;
            });
            $scope.departmentsStaticLabelsResource = modelStaticLabelsFactory.get({model:'department'}, function(data){
                $scope.departments = data.labels.department;
            });
            $scope.currencyIsoLabelsResource = modelIsoLabelsFactory.get({model:'currency'}, function(data){
                $scope.currencies = data.labels.currency;
            });

            $scope.showNewClientForm = false;
            $scope.defaultClient = {
                'name':'Client\'s Name',
                'address':'5 jalan bukit merah',
                'city': 'Singapore',
                'postcode' : '159960',
                'country_code':'SGP',
                'phone_number':'+6599999999'
            };

        }

        init();

        /* Display new form */
        $scope.showNewClient= function () {
            $scope.showNewClientForm = !$scope.showNewClientForm;

            if($scope.showNewClientForm){
                /* Create a default empty client*/
                $scope.client = $scope.defaultClient;
            }
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
