'use strict';

sentinelfApp
.directive("editInputCheck"
    , function() {

        var editTemplate =
                '<div ng-hide="editForm">' +
                    '{{value | checkmark}} ' +
                '</div>' +
                '<div ng-show="editForm">' +
                    '<input type="checkbox" class="input-sm" ng-model="value" ng-true-value="{{1}}" ng-false-value="{{0}}">' +
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

/*
* create filter for property check
*/
sentinelfApp.filter('checkmark', function(){
    return function(input){
        return (input == 1) ? '\u2713' : '';
    }
});