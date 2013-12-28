'use strict';

sentinelfApp
.directive("editInputDate"
    , function() {

        var editInputDateTemplate =
            '<div ng-hide="editForm">' +
                '{{date | date:\'fullDate\'}} ' +
            '</div>' +
            '<div ng-show="editForm">' +
                '<input type="date" ng-model="date" class="form-control input-sm"></datepicker>' +
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
