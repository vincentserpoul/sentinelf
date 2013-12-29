'use strict';

sentinelfApp.controller(
    'EmployeesListCtrl', [
    '$scope', 'employeesListProgressiveFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory',
    function($scope, employeesListProgressiveFactory, modelStaticLabelsFactory, modelIsoLabelsFactory) {

        init();

        /* Regroup init of the page in one single function */
        function init() {
            /* Load the progressive service to load list of employees */
            $scope.employeesListProgressiveFactory = new employeesListProgressiveFactory();

            /* Get the labels necessary for the list not to be only numbers */
            $scope.staticLabelListResource = modelStaticLabelsFactory.get({model:'employee'});

            /* For access in the list directly */
            $scope.staticLabelListResource.$promise.then(function(data){
                $scope.employeeStaticLabels = data['labels'];
            });

            /* Get the labels necessary for the list of countries not to be only codes */
            $scope.countryListResource = modelIsoLabelsFactory.get({model:'country'});

        }

        $scope.searchEmployees = function (){
            /* Get the employee list */
            employeesFactory.search({listFilterParams: angular.toJson(this.searchCriterias)}, function(data){
                $scope.employees = data['employees'];
            });
        }

    }
]);
