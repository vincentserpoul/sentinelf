'use strict';

sentinelfApp.controller(
    'EmployeeViewCtrl', [
    '$scope', '$routeParams', '$location', '$filter', 'employeesFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory',
    function($scope, $routeParams, $location, $filter, employeesFactory, modelStaticLabelsFactory, modelIsoLabelsFactory){

	    init();

	    /* Regroup init of the page in one single function */
	    function init() {
	        /* Get the employee list */
	        employeesFactory.get({employeeId:$routeParams['employeeId']}, function(data){
	            $scope.employee = data['employees'][0];
	        });

	        /* Get the labels necessary for the list not to be only numbers */
	        modelStaticLabelsFactory.get({model:'employee'}, function(data){
	            $scope.employeeStaticLabels = data['labels'];
	        });

			modelIsoLabelsFactory.get({model:'country'}, function(data){
	            $scope.employeeIsoLabels = data['labels'];
	        });
	    }

	    $scope.superLog= function (){
	    	console.log($scope.employee);
	    }

		$scope.save = function (){
			/* Make sure the date is saved in the correct format */
			$scope.employee.date_of_birth = $filter('date')(new Date($scope.employee.date_of_birth), 'yyyy/MM/dd');

	        if($scope.employee.id){
	            /* Call the factory to update the new employee in db */
	            employeesFactory.update($scope.employee,
	                function(){
	                    $location.path( "/employees" );
	                }
	            );
	        } else {
	            /* Call the factory to create the new employee in db */
	            employeesFactory.save($scope.employee,
	                function(){
	                    $location.path( "/employees" );
	                }
	            );
	        }
    	}
    }
]);
