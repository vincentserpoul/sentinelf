'use strict';

sentinelfApp.controller(
    'EmployeesListCtrl', [
    '$scope', 'employeesSearchLazyloadFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory', 'employeesFactory',
    function ($scope, employeesSearchLazyloadFactory, modelStaticLabelsFactory, modelIsoLabelsFactory, employeesFactory) {

        /* Regroup init of the page in one single function */
        function init() {

            /* Get the labels necessary for the list not to be only numbers */
            $scope.staticLabelListResource = modelStaticLabelsFactory.get({model:'employee'}, function(data){
                $scope.employeeStaticLabels = data.labels;
            });

            /* Get the labels necessary for the list of countries not to be only codes */
            $scope.countryListResource = modelIsoLabelsFactory.get({model:'country'}, function(data){
                $scope.countries = data.labels.country;
            });

            $scope.showNewForm = false;

        }

        init();

        $scope.searchEmployees = function (){
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

        /* Display new form */
        $scope.showNewEmployee = function () {
            $scope.showNewForm = !$scope.showNewForm;

            if($scope.showNewForm){
                $scope.employeeNewTemplate = 'views/employees/employeeNew.html';
                /* Get needed select list */

                /* Create a defulat empty employee */
                $scope.defaultEmployee = {
                    'title_id':1,
                    'first_name':'First name',
                    'last_name':'Last name',
                    'sex_id':1,
                    'country_code':'SGP',
                    'date_of_birth':'1980-01-01',
                    'mobile_phone_number':'+65',
                    'school':'School',
                    'join_date':'2012-02-03 00:00:00',
                    'race_id':1,
                    'status_id':1,
                    'work_pass_type_id':1,
                    'employee_identity_doc':[],
                    'employee_doc':[]
                };
            } else {
                $scope.employeeNewTemplate = '';
            }
        };

    }
]);
