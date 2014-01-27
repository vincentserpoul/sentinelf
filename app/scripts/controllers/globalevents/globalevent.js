'use strict';

sentinelfApp.controller("GlobaleventCtrl", ['$scope', '$modal', 'globaleventPeriodsLazyloadFactory', 'globaleventsFactory',
    function ($scope, $modal, globaleventPeriodsLazyloadFactory, globaleventsFactory) {

        init();

        function init(){
            /* hide event period details at first launch */
            $scope.openGlobaleventPeriods = false;
        }

        /* Delete globalevent button for each globalevent */
        $scope.deleteGlobalevent = function(){

            globaleventsFactory.delete({globaleventId:$scope.globalevent.id},
                function(data){
                    if(data && data['error'] == false){
                        /* Get the index of the targeted event */
                        var index = $scope.globaleventsLazyloadFactory.globalevents.indexOf($scope.globalevent);
                        /* Destroy it */
                        $scope.globaleventsLazyloadFactory.globalevents.splice(index, 1);
                        /* Counter -1 */
                        $scope.globaleventsLazyloadFactory.total -= 1;
                    } else {
                        console.log(data['error']);
                    }

                }
            );
        }

        /* Edit an existing event */
        $scope.editGlobalevent = function () {
            /* Load dept */
            $scope.loadClientDepartments();
            /* Change the template from view to edit */
            $scope.globaleventEditTemplate = 'views/globalevents/globaleventEdit.html';
            $scope.globaleventTemplate = $scope.globaleventEditTemplate;

        }

        /* update an existing global event */
        $scope.saveGlobalevent = function () {
            /* Launch service to create new db */
            globaleventsFactory.update({eventId:$scope.globalevent.Id}, $scope.globalevent, function(data){
                $scope.globaleventTemplate = $scope.globaleventViewTemplate;
                angular.extend($scope.globalevent, data['globalevents'][0]);
            });
        };

        $scope.cancelEditGlobalevent = function () {
            /* Change the template from view to edit */
            $scope.globaleventTemplate = $scope.globaleventViewTemplate;
        };

        /* Load the list of glbalevent_periods */
        $scope.loadGlobaleventPeriods = function(){
                /* Load the progressive service to load list of globalevents */
                $scope.globaleventPeriodsLazyloadFactory = new globaleventPeriodsLazyloadFactory($scope.globalevent.id);
                /* First launch */
                $scope.globaleventPeriodsLazyloadFactory.loadMore();

                $scope.globaleventPeriodViewTemplate = 'views/globalevents/globaleventPeriods/globaleventPeriodView.html';
                /* Open the template */
                $scope.openGlobaleventPeriods = !$scope.openGlobaleventPeriods;
        }

        $scope.openAssignments = function () {
            var assignmentsModalInstance = $modal.open({
                    templateUrl: 'views/globalevents/assignments/assignmentsList.html',
                    controller: 'AssignmentsCtrl',
                    resolve: {
                        globalevent_id: function () {
                            return $scope.globalevent.id;
                        },
                        label: function () {
                            return $scope.globalevent.label;
                        }
                    }
                });
        }

}]);
