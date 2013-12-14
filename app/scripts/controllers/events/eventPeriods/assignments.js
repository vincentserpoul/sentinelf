'use strict';

sentinelfApp.controller("EventPeriodsAssignmentsCtrl", ['$scope', '$http','$filter', function($scope, $http, $filter){

	$scope.unassign = function () {
        // Save event in case of cancel, to rollback to previous values
        $scope.savEventPeriodEmployee = angular.copy($scope.eventsPeriods.eventperiodemployee);
        // Activate the edit
        $scope.unassignForm = true;
    }

    $scope.save = function () {
    	$scope.unassignForm = false;
    }

    $scope.cancel = function () {
    	$scope.unassignForm = false;
    }

}]);
