'use strict';

sentinelfApp.controller('ContactsCtrl', ['$scope', 'crud', function($scope, crud) {
    var obj = 'contact';
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
    $scope.contactTemplate = $scope.viewTemplate;

    $scope.newContact = function () {
        crud.new($scope, obj, preselectedValues);
    }

    $scope.saveContact = function () {
        crud.create($scope, obj, true);
    }

    $scope.cancelNewContact = function () {
        crud.cancelNew($scope);
    }
}])

sentinelfApp.controller('ContactCtrl', ['$scope', 'crud', function($scope, crud) {
    var obj = 'contact';

    $scope.editContact = function () {
        crud.edit($scope, obj);
    }

    $scope.saveContact = function(){
        crud.save($scope, obj);
    };

    $scope.cancelEditContact = function(){
        crud.cancelEdit($scope, obj);
    };

    $scope.deleteContact = function(){
        crud.delete($scope, obj, 'first_name', true)
    }
}])