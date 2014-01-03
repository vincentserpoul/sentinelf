'use strict';

sentinelfApp
.directive("editInputCheck"
    , function() {

        var editTemplate =
                '<div ng-hide="editForm">' +
                    '{{check | checkmark}} {{label}} ' +
                '</div>' +
                '<div ng-show="editForm" class="checkbox">' +
                    '<label><input type="checkbox" ng-model="check" ng-change="change()"/> {{label}}</label>' +
                '</div>';

        return {
            restrict: 'EA',
            template: editTemplate,
            scope: {
                label: '=',
                value: '=',
                editForm: '='
            },
            link: function (scope) {
                scope.check = (scope.value) ? true : false;

                scope.change = function () {
                    scope.value = (scope.check) ? 1 : 0;
                }
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