'use strict';

sentinelfApp.controller('EventsAssignmentsCtrl', ['$scope', 'employeesFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', function($scope, employeesFactory, modelStaticLabelsFactory, modelIsoLabelsFactory){

	init();

	function init(){
		employeesFactory.get(function(data){
			$scope.employees = data['employees'];
		})

		$scope.employeeStaticLabelsResource = modelStaticLabelsFactory.get({model: 'employee'});

		/* Get the labels necessary for the list of countries not to be only codes */
        $scope.countryListResource = modelIsoLabelsFactory.get({model:'country'});
	}

	$scope.assign = function () {
		
	}
}])