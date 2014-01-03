'use strict';

sentinelfApp
.directive("editInputText"
    , function() {

        var editInputTextTemplate =
            '<div ng-if="editForm == false" class="button-edit">' +
                '{{value}} ' +
            '</div>' +
            '<div ng-show="editForm == true" class="button-edit">' +
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
