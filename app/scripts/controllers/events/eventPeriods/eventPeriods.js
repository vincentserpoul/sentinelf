'use strict';

sentinelfApp.controller("EventPeriodCtrl", ['$scope', '$modal', '$http' ,'eventsFactory','eventPeriodFactory',function($scope, $modal , $http ,eventsFactory, eventPeriodFactory){

    $scope.editEventPeriod = function(){
        // Save eventPeriod in case of cancel, to rollback to previous values
        $scope.savEventPeriod = angular.copy($scope.eventPeriod);
        // Activate the edit
        $scope.edit = true;
    }

    $scope.saveEventPeriod = function(){
        /* Call the factory to update the new eventPeriod in db */
        //console.log($scope.eventPeriod);
        eventPeriodsFactory.update($scope.eventPeriod,
            function(data){
                // when success, reset the savEventPeriod
                $scope.savEventPeriod = null;
                $scope.edit = false;
            }
        );
    };

    $scope.cancelEditEventPeriod = function(){
        // Reset the data to what it was before the edit
        $scope.eventPeriod = $scope.savEventPeriod;
        // Deactivate the edit
        $scope.edit = false;
    };

    /* Delete employee button for each employee */
    $scope.deleteEventPeriod = function(){

        var modalInstance = formService.popup('eventPeriod', $scope.eventPeriod.name);

        modalInstance.result.then(function(){
            eventPeriodsFactory.delete({eventPeriodId:$scope.eventPeriod.id},
                function(data){
                    if(data && data['error'] == false){
                        $scope.eventPeriod.delete();
                    } else {
                        console.log(data['error']);
                    }

                }
            );
        });
    }

}]);

sentinelfApp.controller("EventPeriodEditCtrl", ['$scope', '$modalInstance', '$http' ,'eventsFactory', 'eventPeriodFactory', 'eventPeriodForm', 'event', 'dialog',function($scope, modalInstance, $http ,eventsFactory, eventPeriodFactory ,eventPeriodForm, event, dialog){

    init();

    function init(){

        /*$http.get("data/event-period.json")
            .then(function(response){
                $scope.eventperiods = response.data.GlobaleventPeriods;
            });*/
        eventPeriodFactory.get(function(data){
            $scope.eventperiods = data.GlobaleventPeriods;
        });

        if(eventPeriodForm, event){
            $scope.event = event;
            $scope.eventPeriodForm = eventPeriodForm;
        } else {
            console.log("No event period form, an unexpected condition");
        }
    }



    $scope.saveEventPeriod = function(eventPeriodForm, event){
        if(eventPeriodForm){
            if( ( (eventPeriodForm.id) && (eventPeriodForm.id > 0)) &&  ( (event.id) && (event.id >0) )){
                eventPeriodForm.globalevent_id=event.id;
                console.log("Updating event "+eventPeriodForm.globalevent_id);
                console.log("Updating event "+JSON.stringify(eventPeriodForm));
                eventPeriodFactory.update(eventPeriodForm);
            }else if( ( (!eventPeriodForm.id) || (eventPeriodForm.id ==  0)) && ( (event.id) && (event.id >0) ) ){
                eventPeriodForm.globalevent_id=event.id;
                console.log("Saving event "+eventPeriodForm.globalevent_id);
                console.log("Saving event "+JSON.stringify(eventPeriodForm));

                eventPeriodFactory.save(eventPeriodForm);
            }
        }
        modalInstance.close(eventPeriodForm);
    };

}]);