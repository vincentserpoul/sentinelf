'use strict';

sentinelfApp.controller("EventsCtrl", ['$scope', 'crud', 'eventsLazyloadFactory', 'employersFactory', 'departmentsFactory', function ($scope, crud, eventsLazyloadFactory, employersFactory, departmentsFactory){

    $scope.eventTemplate = 'views/events/eventView.html';
    /* Load the progressive service to load list of employees */
    $scope.eventsLazyloadFactory = new eventsLazyloadFactory();
    /* First launch */
    $scope.eventsLazyloadFactory.loadMore();
    $scope.showNew = false;

    $scope.loadEmployersAndDepartments = function () {
        //Fetch all events
        employersFactory.get(function (data) {
            $scope.employers = data['employers'];
        });

        //Fetch all departments
        departmentsFactory.get(function (data) {
            $scope.employer_departments = data['EmployerDepartments'];
        });
    }

    var obj = 'event';
    var preselectedValues = {
        "label":"Event's name",
        "employer_id": 1,
        "employer_department_id": 1,
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

    $scope.updateEmployer = function () {
        if ($scope.new_event.employer_id) {
            var employer = null;
            for (var i in $scope.employers) {
                if ($scope.employers[i].id == $scope.new_event.employer_id) {
                    employer = $scope.employers[i];
                    break;
                }
            }
        }
    }
}]);


sentinelfApp.controller("EventCtrl", ['$scope', 'crud', '$modal', 'eventPeriodsLazyloadFactory', function ($scope, crud, $modal, eventPeriodsLazyloadFactory) {
    var obj = 'event';

    $scope.editEvent = function () {
        crud.edit($scope, obj);
    }

    $scope.saveEvent = function () {
        crud.save($scope, obj);
    };

    $scope.cancelEditEvent = function () {
        crud.cancelEdit($scope, obj);
    };

    /* Delete employee button for each employee */
    $scope.deleteEvent = function () {
        crud.delete($scope, obj);
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
