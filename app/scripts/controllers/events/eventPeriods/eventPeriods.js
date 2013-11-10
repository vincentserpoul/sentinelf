'use strict';

sentinelfApp.controller("EventPeriodsCtrl", ['$scope', '$dialog', '$http' ,'eventsFactory','eventPeriodFactory',function($scope, $dialog , $http ,eventsFactory, eventPeriodFactory){

    $scope.assignmentListCollapsed = true;

    $scope.openNewEditEventPeriodDialog = function(eventPeriodForm, event){
        var opts = {
            backdrop: false,
            keyboard: true,
            backdropClick: false,
            templateUrl:  'views/events/eventPeriods/eventPeriodForm.html',
            controller: 'EventPeriodEditCtrl',
            resolve: {
                eventPeriodForm: function () { return eventPeriodForm; },
                event: function() {return event;}
            }
        };
        var d = $dialog.dialog(opts);

        d.open().then(
            function(eventPeriodForm){
                $scope.init();
            }
        );
    };

}]);

sentinelfApp.controller("EventPeriodEditCtrl", ['$scope', '$dialog', '$http' ,'eventsFactory', 'eventPeriodFactory', 'eventPeriodForm', 'event', 'dialog',function($scope, $dialog, $http ,eventsFactory, eventPeriodFactory ,eventPeriodForm, event, dialog){

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
        dialog.close(eventPeriodForm);
    };

}]);