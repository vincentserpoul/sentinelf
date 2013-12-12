'use strict';

sentinelfApp
.directive("editInputDatetime"
    , function() {

        var editInputDatetimeTemplate =
            '<div ng-hide="editForm" class="show-hide-animation">' +
                '{{datetime | date:\'short\'}} ' +
            '</div>' +
            '<div ng-show="editForm" class="show-hide-animation">' +
                '<datepicker ng-model="datetime" starting-day="1" show-weeks="0"></datepicker>' +
                '<timepicker ng-change="change()" ng-model="datetime" hour-step="1" minute-step="15" show-meridian="false"></timepicker>'
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
