'use strict';

sentinelfApp.controller('EventsAssignmentsCtrl', ['$scope', 'employeesFactory', function($scope, employeesFactory){

	init();

	function init(){
		employeesFactory.get(function(data){
			$scope.employees = data['employees'];
		})
	}
}])