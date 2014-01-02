'use strict';

sentinelfApp.controller('ContactsCtrl', ['$scope', 'formService', 'AlertService', 'contactsFactory', 'modelStaticLabelsFactory', function($scope, formService, AlertService, contactsFactory, modelStaticLabelsFactory) {

    init();

    /* Regroup init of the page in one single function */
    function init() {
        $scope.newForm = true;
    };

    $scope.newContact = function () {
        // preselected values for new contact
        $scope.createdContacts = [{
            "employer_id": $scope.employer.id,
            "first_name": "contact's first name",
            "last_name": "contact's last name",
            "title_id": 1,
            "sex_id": 1,
            "mobile_phone_number": "+6599999999",
            "primary_contact": 0}];
        $('#collapseNewContact' + $scope.employer.id).collapse('show');
    }

    $scope.saveContact = function () {
        /* Call the factory to update the new contact in db */
        //update codes
        //update title ids and sex ids
        $scope.createdContacts[0].title_id = $scope.createdContacts[0].title['id'];
        $scope.createdContacts[0].sex_id = $scope.createdContacts[0].sex['id'];

        contactsFactory.save($scope.createdContacts[0],
            function (data) {
                if (data) {
                    $scope.contacts.push(data['EmployerContact']);
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
    $scope.editContact = function(){
        // Save contact in case of cancel, to rollback to previous values, deep copy
        $scope.savContact = angular.copy($scope.contact);
        // shallow copy code
        $scope.savContact.title = $scope.contact.title;
        $scope.savContact.sex = $scope.contact.sex;
        // Activate the edit
        $scope.editForm = true;
    }

    $scope.saveContact = function(){
        /* Call the factory to update the new contact in db */
        //update title ids and sex ids
        $scope.contact.title_id = $scope.contact.title['id'];
        $scope.contact.sex_id = $scope.contact.sex['id'];
        
        contactsFactory.update($scope.contact,
            function (data) {
                if (data) {
                    // when success, reset the savEmployer
                    $scope.savContact = null;
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
        $scope.contact = $scope.savContact;
        // Deactivate the edit
        $scope.editForm = false;
    };

    /* Delete employee button for each employee */
    $scope.deleteContact = function(){

        var modalInstance = formService.popup('contact', $scope.contact.first_name + ' ' + $scope.contact.last_name);

        modalInstance.result.then(function(){
            contactsFactory.delete({contactId:$scope.contact.id},
                function (data) {
                    $scope.contacts.splice(formService.findInArray($scope.contacts, $scope.contact.id), 1);
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