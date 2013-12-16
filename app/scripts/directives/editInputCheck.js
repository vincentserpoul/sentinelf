'use strict';

sentinelfApp
.directive("editInputCheck"
    , function() {

        var editTemplate =
                '<div ng-hide="editForm" class="show-hide-animation">' +
                    '{{value | checkmark}} {{label}} ' +
                '</div>' +
                '<div ng-show="editForm" class="show-hide-animation">' +
                    '<input type="checkbox" class="input-sm" ng-model="value" /> {{label}}' +
                '</div>';

        return {
            restrict: 'EA',
            template: editTemplate,
            scope: {
                label: '=',
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
        return input ? '\u2713' : '\u2717';
    }
});