'use strict';

sentinelfApp
.directive("editInputSelectId"
    , function() {

        var editorTemplate =
            '<div ng-hide="editForm">' +
                '{{(ngModelLabels | filter:selectedId)[0].label}} ' +
            '</div>' +
            '<div ng-show="editForm">' +
                '<select ng-model="selectedLabel" ng-options="modelLabel.label for modelLabel in ngModelLabels" required></select>' +
            '</div>' +
        '</div>';

        return {
            restrict: "A",
            replace: true,
            template: function(){return editorTemplate;},
            scope: {
                selectedId: '=',
                ngModelLabels: '=',
            },
            controller: function($scope) {

                init();

                function init(){
                    $scope.selectedLabel = $scope.findObjectById(ngModelLabels, selectedId);
                }

                /* Function to find the object corresponding to the static labels for a given id */
                $scope.findObjectById = function (listObject, idObject){
                    for(var i in listObject){
                        if(listObject[i].id == idObject) {return listObject[i]};
                    }
                    return listObject[0];
                }
            }
        };
    }
);
