'use strict';

sentinelfApp.controller('AssignmentsCtrl',
    ['$scope', '$modalInstance', 'globaleventsFactory', 'employeesSearchLazyloadFactory', 'globaleventId', 'globaleventPeriodEmployeesFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', 'AlertService',
    function ($scope, $modalInstance, globaleventsFactory, employeesSearchLazyloadFactory, globaleventId, globaleventPeriodEmployeesFactory, modelStaticLabelsFactory, modelIsoLabelsFactory, AlertService) {

        /* Regroup init of the page in one single function */
        function init() {
            // Get details about the current global event
            globaleventsFactory.get({globaleventId:globaleventId}, function(data){
                $scope.globalevent = data.globalevents[0];
            });

            /* Get the labels necessary for the list not to be only numbers */
            $scope.staticLabelListResource = modelStaticLabelsFactory.get({model:'employee'}, function(data){
                $scope.employeeStaticLabels = data.labels;
            });

            /* Get the labels necessary for the list of countries not to be only codes */
            $scope.countryListResource = modelIsoLabelsFactory.get({model:'country'}, function(data){
                $scope.countries = data.labels.country;
            });
        }

        init();

        /* search employees according to the given criterias as well as the globaleventid */
        $scope.searchEmployees = function (){

            /* specify which globalevent we are targeting to get results with assignments info */
            this.searchCriterias.globalevent_id = $scope.globalevent.id;

            /* Load the progressive service to load list of employees */
            $scope.employeesSearchLazyloadFactory = new employeesSearchLazyloadFactory(this.searchCriterias);
            /* First launch */
            $scope.employeesSearchLazyloadFactory.loadMore();
            /* display the search results */
            $scope.displayList = true;
        };

        $scope.clearEmployees = function (){
            /* Load the progressive service to load list of employees */
            $scope.employeesSearchLazyloadFactory = null;
            /* hide search results */
            $scope.displayList = false;
            /* criterias resetted too */
            this.searchCriterias = null;
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }
]);
