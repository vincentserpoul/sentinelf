'use strict';

sentinelfApp
.directive("editInputDatetime"
    , function() {

        var editInputDatetimeTemplate =
            '<div ng-hide="editForm">' +
                '{{datetime | date:\'yyyy-MM-dd HH:mm:ss\'}} ' +
            '</div>' +
            '<div ng-show="editForm">' +
                '<input type="datetime" ng-model="datetime" class="form-control input-sm"/>'
            '</div>';

        return {
            restrict: 'EA',
            template: editInputDatetimeTemplate,
            scope: {
                datetime: '=',
                editForm: '='
            }
        };
    }
);
