'use strict';

sentinelfApp.controller("GlobaleventsListCtrl", ['$scope', 'globaleventsLazyloadFactory', 'globaleventsFactory', 'clientDepartmentsFactory',
    function ($scope, globaleventsLazyloadFactory, globaleventsFactory, clientDepartmentsFactory){

        init();

        /* Regroup init of the page in one single function */
        function init() {
            /* Setting the view template */
            $scope.globaleventViewTemplate = 'views/globalevents/globaleventView.html';
            /* Setting up the default template in the list */
            $scope.globaleventTemplate = $scope.globaleventViewTemplate;
            /* Load the progressive service to load list of globalevents */
            $scope.globaleventsLazyloadFactory = new globaleventsLazyloadFactory();
            /* First launch */
            $scope.globaleventsLazyloadFactory.loadMore();
            /* Hide new form */
            $scope.showNewForm = false;
        }

        /* Load clients and deps */
        $scope.loadClientDepartments = function () {
            if (!($scope.clients && $scope.client_departments)) {
                //Fetch all departments
                clientDepartmentsFactory.get(function (data) {
                    $scope.client_departments = data['client_departments'];
                });
            }
        }

        /* Display new form */
        $scope.newGlobalevent = function () {
            $scope.showNewForm = !$scope.showNewForm;

            if($scope.showNewForm){
                $scope.globaleventNewTemplate = 'views/globalevents/globaleventNew.html';
                /* Get needed select list */
                $scope.loadClientDepartments();
                /* Default evetn data */
                $scope.new_globalevent = {
                        "client_id": 1,
                        "client_department_id": 1
                };
            } else {
                $scope.globaleventNewTemplate = '';
            }
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
