'use strict';

sentinelfApp.controller("EventsCtrl", ['$scope', 'formService', 'AlertService', 'eventsFactory', 'employeesFactory', 'employersFactory', 'departmentsFactory', 'eventPeriodFactory', 'eventPeriodEmployeeFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', 'employeesEventPeriodsFactory', function ($scope, formService, AlertService, eventsFactory, employeesFactory, employersFactory, departmentsFactory, eventPeriodFactory, eventPeriodEmployeeFactory, modelStaticLabelsFactory, modelIsoLabelsFactory, employeesEventPeriodsFactory){

   init();

    function init(){
        //Fetch all events and events' periods
        eventsFactory.get(function (data) {
            $scope.events = data['Globalevents'];  
            $scope.eventPeriodResource = eventPeriodFactory.get(function (data) {
                $scope.eventsPeriods = data['GlobaleventPeriods'];
                for(var i = 0; i < $scope.events.length; i++){
                    $scope.events[i]['event_periods'] = $scope.eventsPeriods.filter(function(value, index){return value.globalevent_id == $scope.events[i]['id']})

                } 
            });
        });

        //Fetch all assignments
        employeesEventPeriodsFactory.get({'event_id': 0}, function (data) {
            $scope.employees = data['Employees'];
            eventPeriodEmployeeFactory.get(function (data) {
                $scope.eventPeriodEmployees = data['GlobaleventPeriodEmployees'];
            })
        })

        $scope.employeeStaticLabelsResource = modelStaticLabelsFactory.get({model: 'employee'});

        /* Get the labels necessary for the list of countries not to be only codes */
        $scope.countryListResource = modelIsoLabelsFactory.get({model:'country'});

        //Fetch all events
        $scope.employersResource = employersFactory.get();

        //Fetch all departments
        $scope.departmentsResource = departmentsFactory.get();
    };

    $scope.newEvent = function () {
        // preselected values for new employer
        $scope.createdEvents = [{
            "label":"Event's name",
            "employer_id": 1,
            "employer_department_id": 1,
            "date" : "2013-01-01"}];
        $('#collapseNewEvent').collapse('show');
    }

    $scope.saveNewEvent = function () {
        // get code from model
        $scope.createdEvents[0].employer_id = $scope.createdEvents[0].employer['id'];
        $scope.createdEvents[0].employer_department_id = $scope.createdEvents[0].employer_department['id'];
        /* Call the factory to update the new event in db */
        eventsFactory.save($scope.createdEvents[0],
            function (data) {
                if (data) {
                    $scope.events.push(data['Globalevent']);
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }
            }, function (error) {
                if (error['data']) AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
            }
        );
        $('#collapseNewEvent').collapse('hide');
    }

    $scope.cancelNewEvent = function () {
        $('#collapseNewEvent').collapse('hide');
    }
}]);


sentinelfApp.controller("EventCtrl", ['$scope', 'formService', 'AlertService', 'eventsFactory', function ($scope, formService, AlertService, eventsFactory) {
    
    $scope.editEvent = function () {
        // Save event in case of cancel, to rollback to previous values
        $scope.savEvent = angular.copy($scope.event);
        // shallow copy code
        $scope.savEvent.employer = $scope.event.employer;
        $scope.savEvent.employer_department = $scope.event.employer_department;
        // Activate the edit
        $scope.editForm = true;
    }

    $scope.saveEvent = function () {
        // get code from model
        $scope.event.employer_id = $scope.event.employer['id'];
        $scope.event.employer_department_id = $scope.event.employer_department['id'];
        /* Call the factory to update the new event in db */
        eventsFactory.update($scope.event,
            function (data) {
                if (data) {
                    // when success, reset the savEvent
                    $scope.savEvent = null;
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }
            }, function (error) {
                if (error['data'])
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
            }
        );
        $scope.editForm = false;
    };

    $scope.cancelEditEvent = function () {
        // Reset the data to what it was before the edit
        $scope.event = $scope.savEvent;
        // Deactivate the edit
        $scope.editForm = false;
    };

    /* Delete employee button for each employee */
    $scope.deleteEvent = function () {

        var modalInstance = formService.popup('event', $scope.event.name);

        modalInstance.result.then(function(){
            eventsFactory.delete({eventId:$scope.event.id},
                function (data) {
                    $scope.events.splice(formService.findInArray($scope.events, $scope.event.id), 1);
                    if (data)
                        AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }, function (error) {
                    if (error['data'])
                        AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
                }
            );
        });
    }
    
}]);
