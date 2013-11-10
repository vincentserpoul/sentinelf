'use strict';

sentinelfApp
.directive("clickToEditSelectById"
    , function() {

        var editorTemplate = '<div class="click-to-edit">' +
            '<div ng-hide="view.editorEnabled">' +
                '{{(ngModelLabels | filter:selectedId)[0].label}} ' +
                '<a ng-click="enableEditor()">Edit</a>' +
            '</div>' +
            '<div ng-show="view.editorEnabled">' +
                '<select ng-model="view.editableValue" ng-options="modelLabel.label for modelLabel in ngModelLabels" required></select>' +
                '<a href="#" ng-click="save()">Save</a>' +
                ' or ' +
                '<a ng-click="disableEditor()">cancel</a>.' +
            '</div>' +
        '</div>';

        return {
            restrict: "A",
            replace: true,
            template: function(){return editorTemplate;},
            scope: {
                selectedId: '=clickToEditSelectById',
                ngModelLabels: '=',
            },
            controller: function($scope) {

                init();

                function init() {
                    $scope.view = {
                        editorEnabled: false
                    };
                }

                $scope.enableEditor = function() {
                    $scope.view.editorEnabled = true;
                    $scope.view.editableValue = $scope.findObjectById($scope.ngModelLabels, $scope.selectedId);
                };

                $scope.disableEditor = function() {
                    $scope.view.editorEnabled = false;
                };

                $scope.save = function() {
                    $scope.selectedId = $scope.view.editableValue.id;
                    $scope.disableEditor();
                };

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
