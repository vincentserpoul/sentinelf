'use strict';

sentinelfApp.controller('ContactsCtrl', ['$scope', 'formService', 'AlertService', 'contactsFactory', 'modelStaticLabelsFactory', function($scope, formService, AlertService, contactsFactory, modelStaticLabelsFactory) {

    init();

    /* Regroup init of the page in one single function */
    function init() {
        $scope.newForm = true;
    };

    $scope.createdContact = {
        "employer_id": $scope.employer.id,
        "first_name": "contact's first name",
        "last_name": "contact's last name",
        "title_id": 1,
        "sex_id": 1,
        "mobile_phone_number": "+6599999999",
        "primary_contact": 0};
    var setNewValues = false;

    function initContactValues () {
        if (!setNewValues) {
            formService.initValues($scope.createdContact);
            setNewValues = true;
        }
        $('#collapseNewContact' + $scope.employer.id).collapse('show');
    }

    $scope.newContact = function () {
        if (!$scope.contactStaticLabelsResource) {
            $scope.loadContactsResource().$promise.then(function(){
                initContactValues();
            })
        } else initContactValues();
    }

    $scope.saveContact = function () {
        /* Call the factory to update the new contact in db */
        //update codes
        //update title ids and sex ids
        $scope.createdContact.title_id = $scope.createdContact.title['id'];
        $scope.createdContact.sex_id = $scope.createdContact.sex['id'];

        contactsFactory.save($scope.createdContact,
            function (data) {
                if (data) {
                    $scope.contactsLazyloadFactory.contacts.unshift(data['EmployerContact']);
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true); 
                }
                $('#collapseNewContact' + $scope.employer.id).collapse('hide');
            }, function (error) {
                if (error['data'])
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false); 
                $('#collapseNewContact' + $scope.employer.id).collapse('hide');
            }
        );
    }

    $scope.closeNewContact = function () {
        $('#collapseNewContact' + $scope.employer.id).collapse('hide');
    }
}])

sentinelfApp.controller('ContactCtrl', ['$scope', 'formService', 'AlertService', 'contactsFactory', 'modelStaticLabelsFactory', function($scope, formService, AlertService, contactsFactory, modelStaticLabelsFactory) {
    /**
    /* the function is called when users want to add a new contact or edit an contact
    */
    $scope.init = false;

    function initEditContactValues () {
        if (!$scope.init) { 
            $scope.savContact = formService.initValues($scope.contact);
            $scope.init = true;
        }
        // Activate the edit
        $scope.editForm = true;
    }

    $scope.editContact = function () {
        if (!$scope.contactStaticLabelsResource) {
            $scope.loadContactsResource().$promise.then(function(){
                initEditContactValues();
            })
        } else initEditContactValues();
    }

    $scope.saveContact = function(){
        /* Call the factory to update the new contact in db */
        //update title ids and sex ids
        $scope.contact.title_id = $scope.contact.title['id'];
        $scope.contact.sex_id = $scope.contact.sex['id'];
        
        contactsFactory.update($scope.contact,
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

    $scope.cancelEditContact = function(){
        // Reset the data to what it was before the edit
        formService.copyProps($scope.savEmployer, $scope.employer);
        // Deactivate the edit
        $scope.editForm = false;
    };

    /* Delete employee button for each employee */
    $scope.deleteContact = function(){

        var modalInstance = formService.popup('contact', $scope.contact.first_name + ' ' + $scope.contact.last_name);

        modalInstance.result.then(function(){
            contactsFactory.delete({contactId:$scope.contact.id},
                function (data) {
                    $scope.contactsLazyloadFactory.contacts.splice(formService.findInArray($scope.contactsLazyloadFactory.contacts, $scope.contact.id), 1);
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