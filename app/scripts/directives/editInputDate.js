'use strict';

sentinelfApp
.directive("clickToEditDate"
    , function() {

        var editorTemplate =
            '<div>{{selectedDate | date:\'fullDate\'}} ' +
            	'<button ng-click="showDobCalendar = !showDobCalendar" class="btn btn-mini"><i class="icon-calendar"></i></button>' +
        		'<div ng-show="showDobCalendar">' +
            		'<datepicker ng-model="selectedDate" starting-day="1" show-weeks="0"></datepicker>'+
        		'</div>' +
            '</div>';

        return {
            restrict: "A",
            replace: true,
            template: function(){return editorTemplate;},
            scope: {
                selectedDate: '=clickToEditDate',
            },
        };
    }
);
