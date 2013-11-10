'use strict';

sentinelfApp.controller('ContactsCtrl', ['$scope', '$dialog', 'contactsFactory', 'modelStaticLabelsFactory', function($scope, $dialog, contactsFactory, modelStaticLabelsFactory) {

    init();

    /* Regroup init of the page in one single function */
    function init() {
        /* Initialize employer of the contacts*/
        $scope.employer = $scope.$parent.employer;

        /* Initialize the list of contacts */
        contactsFactory.get({employer_id : $scope.employer.id}, function(data){
            $scope.contacts = data['EmployerContacts'];
        });

        /* Get the labels necessary for the list not to be only numbers */
        modelStaticLabelsFactory.get({model:'contact'}, function(data){
            $scope.contactStaticLabels = data['labels'];
        });
    };

    /**
    /* the function is called when users want to add a new contact or edit an contact
    /* a dialog will pop up with a table for users to fill in the information
    */
    $scope.editContact = function(){
        $scope.originalContact = this.contact;
        
        var opts = {
            backdrop: false,
            keyboard: true,
            backdropClick: false,
            templateUrl:  'views/employers/contacts/contactForm.html', // OR: templateUrl: 'path/to/view.html',
            controller: 'ContactEditCtrl',
            resolve: {
                selectedContact: function () { 
                    return {
                        'selectedContact': angular.copy($scope.originalContact),
                        'employer_id': $scope.employer.id
                    }
                }
            }
        };

        var d = $dialog.dialog(opts);

        d.open().then(
            function(data){

                /* If it is successful */
                if(data && data['error'] == false){

                    /* If contact is returned by the dialog and it is an insert */
                    if(data && data['EmployerContact'] && data['action'] == 'insert'){

                        /* Add the contact on top of he list */
                        $scope.contacts.unshift(data['EmployerContact']);

                    } else if(data && data['EmployerContact'] && data['action'] == 'update'){

                        /* Copy back the modified data to the list of contact */
                        /* Note that we can't do a simple "=" between object, angularjs will not append it. We need to use angalar.copy */
                        angular.copy(data['EmployerContact'], $scope.originalContact);

                    }

                }                 
            }
        );
    };

    /* Delete contact button for each contact */
    $scope.deleteContact = function(){

        $scope.originalContact = this.contact;

        var name = "Delete contact";
        var msg = "Are you sure you want to delete contact "
                    + $scope.originalContact.first_name + " " + $scope.originalContact.last_name + "?";

        var btns = [{result: 'cancel', label: 'Cancel'}, {result: 'confirm', label: 'Confirm', cssClass: 'btn-primary'}];

        $dialog.messageBox(name, msg, btns)
        .open()
        .then(function(result){
            if(result == 'confirm'){
                contactsFactory.delete({contactId:$scope.originalContact.id},
                    function(data){
                        if(data && data['error'] == false){
                            $scope.originalContact.delete();
                        } else {
                            console.log(data['error']);
                        }

                    }
                );
            }
        });
    }

}])

/*
* create filter for property check
*/
sentinelfApp.filter('checkmark', function(){
    return function(input){
        return input ? '\u2713' : '';
    }
});

/*
/* controller for adding a new contact or editing an contact
*/
sentinelfApp.controller('ContactEditCtrl', ['$scope', 'dialog', 'contactsFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', 'selectedContact', 'formService', function($scope, dialog, contactsFactory, modelStaticLabelsFactory, modelIsoLabelsFactory, selectedContact, formService){
    // Prefill default value or edited customer
    if(selectedContact.selectedContact){ 
        $scope.formContact = selectedContact.selectedContact;
    } else {
    // Prefill the form with default values
        $scope.formContact = {
                                "employer_id":selectedContact.employer_id,
                                "first_name":"contact's first name",
                                "last_name":"contact's last name",
                                "title_id": 1,
                                "sex_id":1,
                                "mobile_phone_number":"+6599999999",
                                "primary_contact":1
         };
   }

   modelStaticLabelsFactory.get({model:'contact'}, function(data){

        /* On callback of the service, fill the big static select */

        /* Function to find the object corresponding to the static labels for a given id */
        function findObjectById(listObject, idObject){
            for(var i in listObject){
                if(listObject[i].id == idObject) {return listObject[i]};
            }
            return listObject[0];
        }

        // Init title select and preselect the right value
        $scope.contactTitleList = data['labels']['title'];
        // defaulting the selected value
        $scope.formContact.title = findObjectById($scope.contactTitleList, $scope.formContact.title_id); 

        // Init title select and preselect the right value
        $scope.contactSexList = data['labels']['sex'];
        // defaulting the selected value
        $scope.formContact.sex = findObjectById($scope.contactSexList, $scope.formContact.sex_id); 
    });

    $scope.saveDialog = function(contact){

        // create the "id values" from the contact contained in the retrieved form
        $scope.formContact.title_id = $scope.formContact.title.id;
        $scope.formContact.sex_id = $scope.formContact.sex.id;

        if($scope.formContact.id){
            /* Call the factory to update the new contact in db */
            contactsFactory.update($scope.formContact, 
                function(data){
                    dialog.close(data);
                }
            );
        } else {
            /* Call the factory to create the new contact in db */
            contactsFactory.save($scope.formContact,
                function(data){
                        dialog.close(data);
                }
            );
        }
    }

    $scope.closeDialog = function(){
        dialog.close();
    }

}])