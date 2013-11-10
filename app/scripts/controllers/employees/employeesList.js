'use strict';

sentinelfApp.controller(
    'EmployeesListCtrl', [
    '$scope', '$dialog', 'employeesFactory', 'modelStaticLabelsFactory',
    function($scope, $dialog, employeesFactory, modelStaticLabelsFactory) {

        init();

        /* Regroup init of the page in one single function */
        function init() {

            /* Gt the employee list */
            employeesFactory.get(function(data){
                $scope.employees = data['employees'];
            });

            /* Get the labels necessary for the list not to be only numbers */
            modelStaticLabelsFactory.get({model:'employee'}, function(data){
                $scope.employeeStaticLabels = data['labels'];
            });
        }
    }
]);
