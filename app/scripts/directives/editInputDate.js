'use strict';

sentinelfApp
.directive("editInputDate"
    , function() {

        var editInputDateTemplate =
            '<div ng-hide="editForm" class="show-hide-animation">' +
                '{{date | date:\'fullDate\'}} ' +
            '</div>' +
            '<div ng-show="editForm" class="show-hide-animation">' +
                '<datepicker ng-model="date" starting-day="1" show-weeks="0"></datepicker>' +
            '</div>';

        return {
            restrict: 'EA',
            template: editInputDateTemplate,
            scope: {
                date: '=',
                editForm: '='
            }
        };
    }
);
