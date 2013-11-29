'use strict';

sentinelfApp.controller('ContactsCtrl', ['$scope', 'formService', 'AlertService', 'contactsFactory', 'modelStaticLabelsFactory', function($scope, formService, AlertService, contactsFactory, modelStaticLabelsFactory) {

    init();

    /* Regroup init of the page in one single function */
    function init() {
        /* Initialize the list of contacts */
        contactsFactory.get({employer_id : $scope.employer.id}, function(data){
            $scope.contacts = data['EmployerContacts'];
            /* Get the labels necessary for the list not to be only numbers */
            modelStaticLabelsFactory.get({model:'contact'}, function(data){
                $scope.contactStaticLabels = data['labels'];
                // get labels from id
                for (var i in $scope.contacts) {
                    $scope.contacts[i].title = formService.findObjectById($scope.contactStaticLabels['title'], $scope.contacts[i].title_id);
                    $scope.contacts[i].sex = formService.findObjectById($scope.contactStaticLabels['sex'], $scope.contacts[i].sex_id);
                }
            });
        });
        $scope.newForm = true;
    };

    $scope.newContact = function () {
        // preselected values for new contact
        $scope.createdContact = {
            "employer_id": $scope.employer.id,
            "first_name": "contact's first name",
            "last_name": "contact's last name",
            "title_id": 1,
            "sex_id":1,
            "mobile_phone_number": "+6599999999",
            "primary_contact": 0};
        $scope.createdContact.title = formService.findObjectById($scope.contactStaticLabels['title'], $scope.createdContact.title_id);
        $scope.createdContact.sex = formService.findObjectById($scope.contactStaticLabels['sex'], $scope.createdContact.sex_id);
        $('#collapseNewContact' + $scope.employer.id).collapse('show');
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
                    data['EmployerContact'].title = formService.findObjectById($scope.contactStaticLabels['title'], data['EmployerContact'].title_id);
                    data['EmployerContact'].sex = formService.findObjectById($scope.contactStaticLabels['sex'], data['EmployerContact'].sex_id);
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