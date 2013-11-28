'use strict';

sentinelfApp
.directive("editInputText"
    , function() {

        var editTemplate =
                '<div ng-hide="editForm">' +
                    '{{value}} ' +
                '</div>' +
                '<div ng-show="editForm">' +
                    '<input class="form-control input-sm" ng-model="value">' +
                '</div>' +
            '</div>';

        return {
            template: editTemplate,
            scope: {
                value: '=',
                editForm: '='
            }
        };
    }
);
