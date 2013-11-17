'use strict';

sentinelfApp.controller("EventsCtrl", ['$scope', '$modal', 'eventsFactory', 'employersFactory', 'departmentsFactory', 'eventPeriodFactory', function($scope, $modal, eventsFactory, employersFactory, departmentsFactory, eventPeriodFactory){

   $scope.eventPeriodsListCollapsed = true;
   $scope.assignmentsListCollapsed = true;

   init();

    function init(){
        //Fetch all events and events' periods
        eventsFactory.get(function(data){
            $scope.events = data['Globalevents'];        
        }).$then(function(){
            eventPeriodFactory.get(function(data){
                $scope.eventsPeriods = data['GlobaleventPeriods'];
            }).$then(function(){
                for(var i = 0; i < $scope.events.length; i++){
                    $scope.events[i]['event_periods'] = $scope.eventsPeriods.filter(function(value, index){return value.globalevent_id == $scope.events[i]['id']})
                }     
            })
        });

        //Fetch all events
        employersFactory.get(function(data){
            $scope.employers = data['employers'];
        });

        //Fetch all departments
        departmentsFactory.get(function(data){
            $scope.departments = data['EmployerDepartments'];
        });
    };


    $scope.editEvent = function(){
        $scope.originalEvent = this.event;

        var opts = {
                backdrop: false,
                keyboard: true,
                backdropClick: false,
                templateUrl:  'views/events/eventForm.html', // OR: templateUrl: 'path/to/view.html',
                controller: 'EventEditCtrl',
                resolve: {
                    selectedEvent: function () { return angular.copy($scope.originalEvent); },
                    employers: function() {return $scope.employers;},
                    departments: function() {return $scope.departments;}
                }
        };

        var modalInstance = $modal.open(opts);

        modalInstance.result.then(
            function(data){

                /* If it is successful */
                if(data && data['error'] == false){

                    /* If event is returned by the dialog and it is an insert */
                    if(data && data['event'] && data['action'] == 'insert'){

                        /* Add the event on top of he list */
                        $scope.events.unshift(data['event']);

                    } else if(data && data['event'] && data['action'] == 'update'){

                        /* Copy back the modified data to the list of event */
                        /* Note that we can't do a simple "=" between object, angularjs will not append it. We need to use angalar.copy */
                        angular.copy(data['event'], $scope.originalEvent);

                    }

                } else {
                    console.log(data['error']);
                    /* display error */
                }

            }
        );
    };

    $scope.deleteEvent = function(){
        $scope.originalEvent = this.event;

        var name = "Delete event";
        var msg = "Are you sure you want to delete event "
                    + $scope.originalEvent.label + "?";

        var btns = [{result: 'cancel', label: 'Cancel'}, {result: 'confirm', label: 'Confirm', cssClass: 'btn-primary'}];

        $modal.messageBox(name, msg, btns)
        .open()
        .then(function(result){
            if(result == 'confirm'){
                eventsFactory.delete({eventId:$scope.originalEvent.id},
                    function(data){
                        if(data && data['error'] == false){
                            $scope.originalEvent.delete();
                        } else {
                            console.log(data['error']);
                        }

                    }
                );
            }
        });
    }

}]);

/*
/* controller for adding a new event or editing an event
*/
sentinelfApp.controller('EventEditCtrl', ['$scope', '$modalInstance', 'eventsFactory', 'selectedEvent', 'employers', 'departments', 'formService', function($scope, modalInstance, eventsFactory, selectedEvent, employers, departments, formService){
    
    // Prefill default value or edited customer
    if(selectedEvent){ 
        $scope.formEvent = selectedEvent;
    } else {
    // Prefill the form with default values
        $scope.formEvent = {
                                "label":"event name",
                                "employer_id": 0,
                                "employer_department_id": 0,
                                "date" : "1980-01-01",
         };
   }

   $scope.employers = employers;
   $scope.formEvent.employer = formService.findObjectById($scope.employers, $scope.formEvent.employer_id);

   $scope.departments = departments.filter(function(value, index){return value.employer_id == $scope.formEvent.employer_id});
   $scope.formEvent.department = formService.findObjectById($scope.departments, $scope.formEvent.employer_department_id);

   $scope.formEvent.date_dateformat = new Date($scope.formEvent.date);

    $scope.saveDialog = function(){

        if($scope.formEvent.id){
            /* Call the factory to update the new employee in db */
            eventsFactory.update($scope.formEvent, 
                function(data){
                    modalInstance.close(data);
                }
            );
        } else {
            /* Call the factory to create the new employee in db */
            eventsFactory.save($scope.formEvent,
                function(data){
                    modalInstance.close(data);
                }
            );
        }
    }

    $scope.closeDialog = function(){
        modalInstance.close();
    }

    $scope.employerChange = function(){
        $scope.departments = departments.filter(function(value, index){return value.employer_id == $scope.formEvent.employer.id});
        $scope.formEvent.department = formService.findObjectById($scope.departments, 0);
    }

}])
