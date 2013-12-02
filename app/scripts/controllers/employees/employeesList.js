'use strict';

sentinelfApp.controller(
    'EmployeesListCtrl', [
    '$scope', 'employeesFactory', 'modelIsoLabelsFactory',
    function($scope, employeesFactory, modelIsoLabelsFactory) {

        init();

        /* Regroup init of the page in one single function */
        function init() {

            /* Get the employee list */
            employeesFactory.get(function(data){
                $scope.employees = data['employees'];
            });

        }
    }
]);
