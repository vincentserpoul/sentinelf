'use strict';

sentinelfApp.controller("EventsCtrl", ['$scope', 'formService', 'AlertService', 'eventsFactory', 'eventsLazyloadFactory', 'employeesFactory', 'employersFactory', 'departmentsFactory', 'eventPeriodFactory', 'eventPeriodEmployeeFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', 'employeesEventPeriodsFactory', function ($scope, formService, AlertService, eventsFactory, eventsLazyloadFactory, employeesFactory, employersFactory, departmentsFactory, eventPeriodFactory, eventPeriodEmployeeFactory, modelStaticLabelsFactory, modelIsoLabelsFactory, employeesEventPeriodsFactory){

   init();

    function init(){
        $scope.eventTemplate = 'views/events/eventView.html';
        /* Load the progressive service to load list of employees */
        $scope.eventsLazyloadFactory = new eventsLazyloadFactory();
        /* First launch */
        $scope.eventsLazyloadFactory.loadMore();

        /*
        //Fetch all events
        $scope.employersResource = employersFactory.get();

        //Fetch all departments
        $scope.departmentsResource = departmentsFactory.get();
        */
    };

    $scope.setEventPeriodEmployees = function (eventPeriodEmployees) {
        $scope.eventPeriodEmployees = eventPeriodEmployees;
    }

    $scope.setAllPossibleGlobaleventPeriods = function (all_possible_globalevent_periods) {
        $scope.all_possible_globalevent_periods = all_possible_globalevent_periods;
    }

    $scope.newEvent = function () {// preselected values for new event
        $scope.createdEvent = {
            "label":"Event's name",
            "employer_id": 1,
            "employer_department_id": 1,
            "date" : "2013-01-01"};
        $('#collapseNewEvent').collapse('show');
    }

    $scope.saveNewEvent = function () {
        // get code from model
        $scope.createdEvent.employer_id = $scope.createdEvent.employer.id;
        $scope.createdEvent.employer_department_id = $scope.createdEvent.employer_department.id;
        /* Call the factory to update the new event in db */
        eventsFactory.save($scope.createdEvent,
            function (data) {
                $scope.eventsLazyloadFactory.events.unshift(data['Globalevent']);
                AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
            }, function (error) {
                if (error['data']) AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
            }
        )
        $('#collapseNewEvent').collapse('hide');
    }

    $scope.cancelNewEvent = function () {
        $('#collapseNewEvent').collapse('hide');
    }
}]);


sentinelfApp.controller("EventCtrl", ['$scope', '$modal', 'formService', 'AlertService', 'eventsFactory', 'eventPeriodsLazyloadFactory', function ($scope, $modal, formService, AlertService, eventsFactory, eventPeriodsLazyloadFactory) {
    
    $scope.init = false;
    $scope.editForm = false;

    $scope.editEvent = function () {
        $scope.savEvent = {};
        formService.copyProps($scope.event, $scope.savEvent);
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
        formService.copyProps($scope.savEvent, $scope.event);
        // Deactivate the edit
        $scope.editForm = false;
    };

    /* Delete employee button for each employee */
    $scope.deleteEvent = function () {

        var modalInstance = formService.popup('event', $scope.event.label);

        modalInstance.result.then(function(){
            eventsFactory.delete({eventId:$scope.event.id},
                function (data) {
                    $scope.eventsLazyloadFactory.events.splice(formService.findInArray($scope.eventsLazyloadFactory.events, $scope.event.id), 1);
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }, function (error) {
                    if (error['data'])
                        AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
                }
            );
        });
    }

    $scope.loadEventPeriods = function () {
        if (!$scope.eventPeriodsLazyloadFactory) {
            /* Load the progressive service to load list of employees */
            $scope.eventPeriodsLazyloadFactory = new eventPeriodsLazyloadFactory($scope.event.id);
            /* First launch */
            $scope.eventPeriodsLazyloadFactory.loadMore();
        }
        if (!$scope.eventPeriodsTemplate)
            $scope.eventPeriodsTemplate = 'views/events/eventPeriods/eventPeriodsList.html';
        $scope.openEventPeriods = !$scope.openEventPeriods;
    }
    
    $scope.openAssignments = function () {
        var assignmentsModalInstance = $modal.open({
                templateUrl: 'views/events/assignments/assignmentsList.html',
                controller: 'EmployeeEventAssignmentsCtrl',
                resolve: {
                    globalevent_id: function () {
                        return $scope.event.id;
                    },
                    label: function () {
                        return $scope.event.label;
                    }
                }
            });
    }

}]);
