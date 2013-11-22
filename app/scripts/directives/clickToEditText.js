'use strict';

sentinelfApp
.directive("clickToEditText"
    , function() {

        var editTemplate =
                '<div ng-hide="edit">' +
                    '{{value}} ' +
                '</div>' +
                '<div ng-show="edit">' +
                    '<input class="form-control" ng-model="value">' +
                '</div>' +
            '</div>';

        return {
            template: editTemplate,
            scope: {
                value: '=',
                edit: '='
            }
        };
    }
);
