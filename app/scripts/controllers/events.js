'use strict';

sentinelfApp.controller("EventsCtrl", ['$scope', '$modal', 'formService', 'eventsFactory', 'employersFactory', 'departmentsFactory', 'eventPeriodFactory', function ($scope, $modal, formService, eventsFactory, employersFactory, departmentsFactory, eventPeriodFactory){

   init();

    function init(){
        //Fetch all events and events' periods
        eventsFactory.get(function(data){
            $scope.events = data['Globalevents'];  
            eventPeriodFactory.get(function(data){
                $scope.eventsPeriods = data['GlobaleventPeriods'];
                for(var i = 0; i < $scope.events.length; i++){
                    $scope.events[i]['event_periods'] = $scope.eventsPeriods.filter(function(value, index){return value.globalevent_id == $scope.events[i]['id']})
                } 
            });
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

}]);


sentinelfApp.controller("EventCtrl", ['$scope', '$modal', 'formService', 'eventsFactory', 'employersFactory', 'departmentsFactory', 'eventPeriodFactory', function ($scope, $modal, formService, eventsFactory, employersFactory, departmentsFactory, eventPeriodFactory) {
    
    $scope.editEvent = function(){
        // Save event in case of cancel, to rollback to previous values
        $scope.savEvent = angular.copy($scope.event);
        // Activate the edit
        $scope.edit = true;
    }

    $scope.saveEvent = function(){
        /* Call the factory to update the new event in db */
        //console.log($scope.event);
        eventsFactory.update($scope.event,
            function(data){
                // when success, reset the savEvent
                $scope.savEvent = null;
                $scope.edit = false;
            }
        );
    };

    $scope.cancelEditEvent = function(){
        // Reset the data to what it was before the edit
        $scope.event = $scope.savEvent;
        // Deactivate the edit
        $scope.edit = false;
    };

    /* Delete employee button for each employee */
    $scope.deleteEvent = function(){

        var modalInstance = formService.popup('event', $scope.event.name);

        modalInstance.result.then(function(){
            eventsFactory.delete({eventId:$scope.event.id},
                function(data){
                    if(data && data['error'] == false){
                        $scope.event.delete();
                    } else {
                        console.log(data['error']);
                    }

                }
            );
        });
    }
    
}]);
/*
/* controller for adding a new event or editing an event
*/
sentinelfApp.controller('EventEditCtrl', ['$scope', '$modalInstance', 'eventsFactory', 'selectedEvent', 'employers', 'departments', 'formService', function ($scope, modalInstance, eventsFactory, selectedEvent, employers, departments, formService){
    
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
