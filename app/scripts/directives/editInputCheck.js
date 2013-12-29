'use strict';

sentinelfApp
.directive("editInputCheck"
    , function() {

        var editTemplate =
                '<div ng-hide="editForm">' +
                    '{{value | checkmark}} {{label}} ' +
                '</div>' +
                '<div ng-show="editForm" class="checkbox">' +
                    '<label><input type="checkbox" ng-model="value" /> {{label}}</label>' +
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