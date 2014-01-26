'use strict';

sentinelfApp.controller('AssignmentsCtrl',
    ['$scope', '$modalInstance', 'eventFactory', 'employeesSearchLazyloadFactory', 'globalevent_id', 'eventPeriodEmployeeFactory', 'modelStaticLabelsFactory', 'modelIsoLabelsFactory',
    function ($scope, $modalInstance, eventFactory, employeesSearchLazyloadFactory, globalevent_id, eventPeriodEmployeeFactory, modelStaticLabelsFactory, modelIsoLabelsFactory) {

        init();

        /* Regroup init of the page in one single function */
        function init() {
            // Get details about the current global event
            eventFactory.get({eventId:globalevent_id}, function(data){
                $scope.globalEvent = data['globalevents'][0];
            });

            /* Get the labels necessary for the list not to be only numbers */
            $scope.staticLabelListResource = modelStaticLabelsFactory.get({model:'employee'}, function(data){
                $scope.employeeStaticLabels = data['labels'];
            });

            /* Get the labels necessary for the list of countries not to be only codes */
            $scope.countryListResource = modelIsoLabelsFactory.get({model:'country'}, function(data){
                $scope.countries = data['labels']['country'];
            });
        }

        /* search employees according to the given criterias as well as the globaleventid */
        $scope.searchEmployees = function (){

            /* specify which globalevent we are targeting to get results with assignments info */
            this.searchCriterias['globalevent_id'] = $scope.globalEvent.id;

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
            /* criterias resetted too */
            this.searchCriterias = null;
        }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }

    $scope.assign = function (globalevent_period_id) {

        eventPeriodEmployeeFactory.save({'globalevent_period_id': globalevent_period_id, 'employee_id': $scope.employee.id},
            function (data) {
               if (data) {
                    $scope.employee[globalevent_period_id] = globalevent_period_id;
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }
            }, function (error) {
                if (error['data']){
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
                }
            }
        )

    };

    $scope.assign_whole_event = function () {
        wholeEventFactory.save({'globalevent_id': $scope.event.id, 'employee_id': $scope.employee.id},
            function (data) {
                if (data) {
                    for (var i in data['globalevent_period_employees'])
                        $scope.eventPeriodEmployees.push(data['globalevent_period_employees'][i]);
                    employeesEventPeriodsFactory.get({'event_id': 0}, function (data) {
                        $scope.all_possible_globalevent_periods = data['possible_globalevent_periods'];
                    })
                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
                }
            }, function (error) {
                if (error['data']) {
                    for (var i in error['data']['globalevent_period_employees'])
                        $scope.eventPeriodEmployees.push(error['data']['globalevent_period_employees'][i]);
                    employeesEventPeriodsFactory.get({'event_id': 0}, function (data) {
                        $scope.all_possible_globalevent_periods = data['possible_globalevent_periods'];
                    })
                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
                }
            }
        )
    }
}])
