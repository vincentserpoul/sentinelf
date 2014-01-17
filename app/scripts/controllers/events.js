'use strict';

sentinelfApp.controller("EventsCtrl", ['$scope', 'crud', 'eventsLazyloadFactory', 'clientsFactory', 'departmentsFactory', function ($scope, crud, eventsLazyloadFactory, clientsFactory, departmentsFactory){

    $scope.viewTemplate = 'views/events/eventView.html';
    $scope.editTemplate = 'views/events/eventEdit.html';
    $scope.eventTemplate = $scope.viewTemplate;
    /* Load the progressive service to load list of employees */
    $scope.eventsLazyloadFactory = new eventsLazyloadFactory();
    /* First launch */
    $scope.eventsLazyloadFactory.loadMore();
    $scope.showNew = false;

    $scope.loadClientsAndDepartments = function () {
        if (!($scope.clients && $scope.client_departments)) {
            //Fetch all events
            clientsFactory.get(function (data) {
                $scope.clients = data['clients'];
            });

            //Fetch all departments
            departmentsFactory.get(function (data) {
                $scope.client_departments = data['ClientDepartments'];
            });
        }
    }

    var obj = 'event';
    var preselectedValues = {
        "label":"Event's name",
        "client_id": 1,
        "client_department_id": 1,
        "date" : "2013-01-01"};

    $scope.newEvent = function () {
        crud.new($scope, obj, preselectedValues);
    }

    $scope.createEvent = function () {
        crud.create($scope, obj);
    }

    $scope.cancelNewEvent = function () {
        crud.cancelNew($scope);
    }

    $scope.updateClient = function () {
        if ($scope.new_event.client_id) {
            var client = null;
            for (var i in $scope.clients) {
                if ($scope.clients[i].id == $scope.new_event.client_id) {
                    client = $scope.clients[i];
                    break;
                }
            }
        }
    }
}]);


sentinelfApp.controller("EventCtrl", ['$scope', 'crud', '$modal', 'eventPeriodsLazyloadFactory', function ($scope, crud, $modal, eventPeriodsLazyloadFactory) {
    var obj = 'event';

    $scope.editEvent = function () {
        crud.edit($scope, obj, $scope.loadClientsAndDepartments);
    }

    $scope.saveEvent = function () {
        crud.save($scope, obj);
    };

    $scope.cancelEditEvent = function () {
        crud.cancelEdit($scope, obj);
    };

    /* Delete employee button for each employee */
    $scope.deleteEvent = function () {
        crud.delete($scope, obj, 'label');
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
