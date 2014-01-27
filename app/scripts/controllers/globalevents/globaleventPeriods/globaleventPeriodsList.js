'use strict';

sentinelfApp.controller("GlobaleventPeriodsListCtrl", ['$scope', '$filter', 'globaleventPeriodsFactory',
    function ($scope, $filter, globaleventPeriodsFactory) {

        init();

        /* Regroup init of the page in one single function */
        function init() {
            $scope.showNewForm = false;
            $scope.globaleventPeriodViewTemplate = "views/globalevents/globaleventPeriods/globaleventPeriodView.html";
            $scope.globaleventPeriodEditTemplate = "views/globalevents/globaleventPeriods/globaleventPeriodEdit.html";

            $scope.globaleventPeriodTemplate = $scope.globaleventPeriodViewTemplate;
        }

        /* Display new form for global event period */
        $scope.newGlobaleventPeriod = function () {
            $scope.showNewForm = !$scope.showNewForm;

            if($scope.showNewForm){
                /* Default values */

                var dateNow = $filter('date')(Date.now(), 'yyyy-MM-dd HH');
                $scope.new_globaleventPeriod = {
                    "globalevent_id": $scope.globalevent.id,
                    "start_datetime": dateNow+':00',
                    "end_datetime": dateNow+':00',
                    "number_of_employee_needed": 1
                };

                $scope.globaleventPeriodNewTemplate = 'views/globalevents/globaleventPeriods/globaleventPeriodNew.html';
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
                /* Add the newly created eventperiod to the list */
                $scope.globaleventPeriodsLazyloadFactory.globalevent_periods.unshift(data['globalevent_periods'][0]);
                /* Empty the default event */
                $scope.new_globaleventPeriod = null;
            });
        }
}])
