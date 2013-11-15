'use strict';

sentinelfApp.controller("EventPeriodsAssignmentsCtrl", ['$scope', '$http','$filter', function($scope, $http, $filter){

    //Fetch all events
    $scope.initEmployees = function(){
        $http.get("data/unassigned-employees.json")
            .then(function(response){
                $scope.employees = response.data.Employees;
            });
    };

    //Fetch all events
    $scope.initEvent = function(){
        $http.get("data/event.json")
            .then(function(response){
                $scope.dateList = response.data.events.items[0].dates;
            });
    };

    $scope.saveAssignment = function () {
        var selectedEmployees = $filter('filter')($scope.employees, {isSelected: true});
        alert(JSON.stringify(selectedEmployees));
    };

    //Start: Select all box
    $scope.getSelectionState = function(){
        var selectionState = true;
        angular.forEach($scope.employees, function(value, index){
            selectionState = selectionState && false;//value.isSelected;
        });
        return selectionState;
    };

    $scope.areAllSelected = false;

    $scope.$watch('getSelectionState()',function(val){
        if(val !== undefined){
            $scope.areAllSelected = val;
        }
    });

    $scope.onAllSelected = function(){
        for( var i =0;i < $scope.employees.items.length;i++){
            $scope.employees.items[i].isSelected = $scope.areAllSelected;
        }
    };
    //End: Select all box

    sentinelfApp.directive('dateTime', function(){
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, element, attrs, ngModel){
                if (!ngModel) {
                    console.log('no model, returning');
                    return;
                }

                element.bind('blur keyup change', function() {
                    scope.$apply(read);
                });

                read();

                function read() {
                    ngModel.$setViewValue(element.val());
                }
            }
        }
    });

}]);
