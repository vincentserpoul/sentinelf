'use strict';

sentinelfApp.controller("GlobaleventsListCtrl", ['$scope', 'globaleventsLazyloadFactory', 'globaleventsFactory', 'clientFactory', 'departmentFactory',
    function ($scope, globaleventsLazyloadFactory, globaleventsFactory, clientFactory, departmentFactory){

        init();

        /* Regroup init of the page in one single function */
        function init() {
            /* Setting the edit template */
            $scope.editTemplate = 'views/globalevents/globaleventEdit.html';
            /* Setting the view template */
            $scope.globaleventTemplate = 'views/globalevents/globaleventView.html';
            /* Load the progressive service to load list of globalevents */
            $scope.globaleventsLazyloadFactory = new globaleventsLazyloadFactory();
            /* First launch */
            $scope.globaleventsLazyloadFactory.loadMore();
            /* Hide new form */
            $scope.showNewForm = false;
        }

        /* Load clients and deps */
        $scope.loadClientsAndDepartments = function () {
            if (!($scope.clients && $scope.client_departments)) {
                //Fetch all globalevent
                clientFactory.get(function (data) {
                    $scope.clients = data['clients'];
                });

                //Fetch all departments
                departmentFactory.get(function (data) {
                    $scope.client_departments = data['ClientDepartments'];
                });
            }
        }

        /* Display new form */
        $scope.newGlobalevent = function () {
            /* Get needed select list */
            $scope.loadClientsAndDepartments();
            /* Default evetn data */
            $scope.new_globalevent = {
                    "client_id": 1,
                    "client_department_id": 1
            };
            /* Show the form */
            $scope.showNewForm = true;
        }

        /* Cancel new event creation */
        $scope.cancelNewGlobalevent = function () {
            $scope.showNewForm = false;
        }

        /* Save new event */
        $scope.createNewGlobalevent = function() {
            /* hide back the doc forms */
            $scope.showNewForm = false;
            /* Launch service to create new db */
            globaleventsFactory.create($scope.new_globalevent, function(data){
                /* Add the newly created event to the list */
                $scope.globaleventsLazyloadFactory.globalevents.unshift(data['globalevents'][0]);
                /* Empty the default event */
                $scope.new_globalevent = null;
                /* Counter +1 */
                $scope.globaleventsLazyloadFactory.total += 1;
            });
        }

}]);
