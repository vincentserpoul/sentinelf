'use strict';

sentinelfApp
.directive("clickToEditText"
    , function() {

        var editorTemplate = '<div class="click-to-edit">' +
            '<div ng-hide="view.editorEnabled">' +
                '{{value}} ' +
                '<a ng-click="enableEditor()">Edit</a>' +
            '</div>' +
            '<div ng-show="view.editorEnabled">' +
                '<input ng-model="view.editableValue">' +
                '<a href="#" ng-click="save()">Save</a>' +
                ' or ' +
                '<a ng-click="disableEditor()">cancel</a>.' +
            '</div>' +
        '</div>';

        return {
            restrict: "A",
            replace: true,
            template: editorTemplate,
            scope: {
                value: '=clickToEditText',
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
                    $scope.view.editableValue = $scope.value;
                };

                $scope.disableEditor = function() {
                    $scope.view.editorEnabled = false;
                };

                $scope.save = function() {
                    $scope.value = $scope.view.editableValue;
                    $scope.disableEditor();
                };
            }
        };
    }
);

sentinelfApp
.directive("textEditor"
    , function() {

        var editorTemplate = 
            '<div ng-switch on="editor">' + 
                '<div ng-switch-when="disabled">' +
                    '{{value}} ' +
                '</div>' +
                '<div ng-switch-when="enabled">' +
                    '<input class="form-control" ng-change="change(value)" ng-model="value">' +
                '</div>' +
            '</div>';

        return {
            template: editorTemplate,
            scope: {
                value: '=',
                editor: '='
            },
            controller: function ($scope) {
                $scope.change = function (value) {
                    $scope.value = value;
                }
            }
        };
    }
);