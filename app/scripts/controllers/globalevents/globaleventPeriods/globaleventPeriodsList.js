'use strict';

sentinelfApp.controller("GlobaleventPeriodsListCtrl", ['$scope', 'globaleventPeriodsFactory',
    function ($scope, globaleventPeriodsFactory) {

        init();

        /* Regroup init of the page in one single function */
        function init() {
            $scope.showNewForm = false;
            $scope.globaleventPeriodviewTemplate = "views/globalevents/globaleventPeriods/globaleventPeriodView.html";
            $scope.globaleventPeriodeditTemplate = "views/globalevents/globaleventPeriods/globaleventPeriodEdit.html";

            $scope.globaleventPeriodTemplate = $scope.viewTemplate;
        }

        /* Display new form for global event period */
        $scope.newGlobaleventPeriod = function () {
            $scope.showNewForm = !$scope.showNewForm;

            if($scope.showNewForm){
                var preselectedValues = {
                    "globalevent_id": $scope.globalevent.id,
                    "start_datetime": "2013-01-01 00:00:00",
                    "end_datetime": "2013-01-01 00:00:10",
                    "number_of_employee_needed": 1
                };
                $scope.globaleventPeriodNewTemplate = "views/globalevents/globaleventPeriods/globaleventPeriodNew.html";
            } else {
                $scope.globaleventPeriodNewTemplate = '';
            }
        }

        /* Cancel new event creation */
        $scope.cancelNewGlobaleventPeriod = function () {
            $scope.showNewForm = false;
        }

        /* Save new event */
        $scope.createNewGlobaleventPeriod = function() {
            /* hide back the doc forms */
            $scope.showNewForm = false;
            /* Launch service to create new db */
            globaleventPeriodsFactory.create($scope.new_globaleventPeriod, function(data){
                /* Add the newly created event to the list */
                $scope.globaleventPeriodsFactory.globalevent_periods.unshift(data['globalevent_periods'][0]);
                /* Empty the default event */
                $scope.new_globaleventPeriod = null;
            });
        }
}])
