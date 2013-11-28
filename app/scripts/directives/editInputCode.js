'use strict';

sentinelfApp
.directive("editInputCode"
    , function() {

        var editTemplate =
                '<div ng-hide="editForm">' +
                    '{{code["label"]}} ' +
                '</div>' +
                '<div ng-show="editForm">' +
                    '<select class="form-control input-sm" ng-model="code" ng-options="modelLabel.label for modelLabel in ngModelLabels" required></select>' +
                '</div>';

        return {
            template: editTemplate,
            scope: {
                code: '=',
                editForm: '=', 
                ngModelLabels: '='
            }
        };
    }
);
