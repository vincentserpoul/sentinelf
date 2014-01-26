'use strict';

sentinelfApp.controller("GlobaleventCtrl", ['$scope', '$modal', 'globaleventPeriodsLazyloadFactory', 'globaleventsFactory',
    function ($scope, $modal, globaleventPeriodsLazyloadFactory, globaleventsFactory) {

        /* Delete employee button for each employee */
        $scope.deleteGlobalevent = function(){

            globaleventsFactory.delete({eventId:$scope.globalevent.id},
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
            )
        };

        /* Load the list of glbalevent_periods */
        $scope.loadGlobaleventPeriods = function(){
                /* Load the progressive service to load list of globalevents */
                $scope.globaleventPeriodsLazyloadFactory = new globaleventPeriodsLazyloadFactory();
                /* First launch */
                $scope.globaleventPeriodsLazyloadFactory.loadMore();
                /* Assign the template */
                $scope.globaleventPeriodsTemplate = 'views/globalevents/globaleventPeriods/globaleventPeriodsList.html';
                /* Open the template */
                $scope.openEventPeriods = !$scope.openEventPeriods;
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
            });
        };

        $scope.cancelEditGlobalevent = function () {
            /* Change the template from view to edit */
            $scope.globaleventTemplate = $scope.globaleventViewTemplate;
        };

 /*   var obj = 'event';

*/



    //$scope.loadEventPeriods = function () {
    //    if (!$scope.eventPeriodsLazyloadFactory) {
            /* Load the progressive service to load list of employees */
            //$scope.eventPeriodsLazyloadFactory = new eventPeriodsLazyloadFactory($scope.event.id);
            /* First launch */
            //$scope.eventPeriodsLazyloadFactory.loadMore();
        //}
        //if (!$scope.eventPeriodsTemplate)
        //    $scope.eventPeriodsTemplate = 'views/globalevent/eventPeriods/eventPeriodsList.html';
        //$scope.openEventPeriods = !$scope.openEventPeriods;
    //}

    //$scope.openAssignments = function () {
     //   var assignmentsModalInstance = $modal.open({
      //          templateUrl: 'views/globalevent/assignments/assignmentsList.html',
       //         controller: 'AssignmentsCtrl',
        //        resolve: {
         //           globalevent_id: function () {
          //              return $scope.event.id;
           //         },
            //        label: function () {
             //           return $scope.event.label;
              //      }
            //    }
          //  });
    //}

}]);
