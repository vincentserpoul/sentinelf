'use strict';

sentinelfApp
.directive("editInputDatetime"
    , function() {

        var editInputDatetimeTemplate =
            '<div ng-hide="editForm" class="show-hide-animation">' +
                '{{datetime | date:\'yyyy-MM-dd HH:mm:ss\'}} ' +
            '</div>' +
            '<div ng-show="editForm" class="show-hide-animation">' +
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
