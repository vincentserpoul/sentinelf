'use strict';

sentinelfApp
.directive("clickToEditSelectByCode"
    , function() {

        var editorTemplate = '<div class="click-to-edit">' +
            '<div ng-hide="view.editorEnabled">' +
                '{{(ngModelLabels | filter:selectedCode)[0].label}} ' +
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
                selectedCode: '=clickToEditSelectByCode',
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
                    $scope.view.editableValue = $scope.findObjectByCode($scope.ngModelLabels, $scope.selectedCode);
                };

                $scope.disableEditor = function() {
                    $scope.view.editorEnabled = false;
                };

                $scope.save = function() {
                    $scope.selectedCode = $scope.view.editableValue.code;
                    $scope.disableEditor();
                };

        /* For some static label, the iso code is the primary key. So with the key given in the employee table, we need to find the label */
                $scope.findObjectByCode = function (listObject, codeObject){
                    for(var i in listObject){
                        if(listObject[i].code == codeObject) {return listObject[i]};
                    }
                    console.log(listObject[0]);
                    return listObject[0];
                }

            }
        };
    }
);