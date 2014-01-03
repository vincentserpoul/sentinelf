'use strict';

sentinelfApp.controller(
    'EmployeesListCtrl', [
    '$scope', 'employeesSearchLazyloadFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory',
    function ($scope, employeesSearchLazyloadFactory, modelStaticLabelsFactory, modelIsoLabelsFactory) {

        init();

        /* Regroup init of the page in one single function */
        function init() {

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
            /* Load the progressive service to load list of employees */
            $scope.employeesSearchLazyloadFactory = new employeesSearchLazyloadFactory(this.searchCriterias);
            /* First launch */
            $scope.employeesSearchLazyloadFactory.loadMore();
            /* display the search results */
            $scope.displayList = true;
        }

        $scope.clearEmployees = function (){
            /* Load the progressive service to load list of employees */
            $scope.employeesSearchLazyloadFactory = null;
            /* hide search results */
            $scope.displayList = false;
        }

    }
]);
