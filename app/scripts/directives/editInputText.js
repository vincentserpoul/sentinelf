'use strict';

sentinelfApp
.directive("editInputText"
    , function() {

        var editInputTextTemplate =
            '<div ng-hide="editForm" class="button-edit">' +
                '{{value}} ' +
            '</div>' +
            '<div ng-show="editForm" class="button-edit">' +
                '<input class="form-control input-sm" ng-model="value">' +
            '</div>';

        return {
            restrict: 'EA',
            template: editInputTextTemplate,
            scope: {
                value: '=',
                editForm: '='
            }
        };
    }
);
