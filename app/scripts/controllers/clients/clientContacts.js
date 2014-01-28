'use strict';

sentinelfApp.controller('ClientContactsCtrl', ['$scope', 'crud', function($scope, crud) {
    var obj = 'clientContact';
    var preselectedValues = {
            "client_id": $scope.client.id,
            "first_name": "contact's first name",
            "last_name": "contact's last name",
            "title_id": 1,
            "sex_id": 1,
            "mobile_phone_number": "+6599999999",
            "primary_contact": 0};

    $scope.viewTemplate = 'views/clients/contacts/contactView.html';
    $scope.editTemplate = 'views/clients/contacts/contactEdit.html';
    $scope.clientContactTemplate = $scope.viewTemplate;

    $scope.newClientContact = function () {
        crud.new($scope, obj, preselectedValues);
    }

    $scope.saveNewClientContact = function () {
        crud.create($scope, obj, true);
    }

    $scope.cancelNewClientContact = function () {
        crud.cancelNew($scope);
    }
}])

sentinelfApp.controller('ClientContactCtrl', ['$scope', 'crud', function($scope, crud) {
    var obj = 'clientContact';

    $scope.editClientContact = function () {
        crud.edit($scope, obj);
    }

    $scope.saveClientContact = function(){
        crud.save($scope, obj);
    };

    $scope.cancelEditClientContact = function(){
        crud.cancelEdit($scope, obj);
    };

    $scope.deleteClientContact = function(){
        crud.delete($scope, obj, 'first_name', true)
    }
}])
