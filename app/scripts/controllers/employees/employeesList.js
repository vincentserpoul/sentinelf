'use strict';

sentinelfApp.controller(
    'EmployeesListCtrl', [
    '$scope', 'employeesFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory',
    function($scope, employeesFactory, modelStaticLabelsFactory, modelIsoLabelsFactory) {

        init();

        /* Regroup init of the page in one single function */
        function init() {

            /* Get the employee list */
            employeesFactory.get(function(data){
                $scope.employees = data['employees'];
            });

            /* Get the labels necessary for the list not to be only numbers */
            modelStaticLabelsFactory.get({model:'employee'}, function(data){
                $scope.employeeStaticLabels = data['labels'];
            });

            /* Get the labels necessary for the list of countries not to be only codes */
            $scope.countryListResource = modelIsoLabelsFactory.get({model:'country'});
            //$scope.countryList = [{"code":"ABW","label":"Aruba"},{"code":"AFG","label":"Afghanistan"},{"code":"AGO","label":"Angola"},{"code":"IND","label":"INDIA"}];
        }
    }
]);
