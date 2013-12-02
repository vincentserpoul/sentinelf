'use strict';

sentinelfApp
.directive("editInputSelect"
    , function() {

        var editInputSelectTemplate =
            '<div ng-hide="editForm">' +
                '{(modelRefList | filter:uniqIdValue)[0].label}} ' +
            '</div>' +
            '<div ng-show="editForm">' +
                '<select class="form-control input-sm" ng-model="selectedItem" ng-options="item.label for item in modelRefList" required></select>' +
            '</div>';

        return {
            restrict: 'EA',
            template: editInputSelectTemplate,
            scope: {
                uniqIdValue: '=',
                uniqIdType: '@',
                modelReflist: '=',
                editForm: '='
            },
            link: function(scope, element, attrs){
console.log(scope.modelRefList);
// http://stackoverflow.com/questions/20333425/angularjs-pass-resource-as-a-directive-parameter
                function init(){
                    /* Preselect the select box with the given value uniqIdValue */
                    //scope.selectedItem = scope.findItemByUniqId(scope.uniqIdType, scope.modelRefList, scope.uniqIdValue);
                    //console.log(scope['modelRefList']);
                }

                /**
                 * findObjectById: Function to find the item (object) corresponding to the id or code inside a given list
                 *
                 * uniqIdType       string  either 'id' or 'code'
                 * modelRefList     array   ie for countries {{code: "ABW", label: "Aruba"}, {code: "AFG", label: "Afghanistan"}...}
                 * uniqIdValue      object  ie for countries, 'IND', 'FRA', 'CHN'...
                 *
                 * return
                 * selectedItem        object  {code: "ABW", label: "Aruba"}
                **/
                scope.findItemByUniqId = function (uniqIdType, modelRefList, uniqIdValue){

                    /* We only search for the preselected item if there is an actual preselected uniqIdValue */
                    if(uniqIdValue != '' && modelRefList != '' && uniqIdType != ''){
                        /* default selectedItem is the first one */
                        var selectedItem = modelRefList[0];

                        /* loop through the modelfRefList to find the item with the uniqIdValue */
                        angular.forEach(modelRefList, function(listItem){
                            /* if we find the uniqIdValue in the list, we put it inside selectedItem */
                            if(listItem[uniqIdType] == uniqIdValue){
                                selectedItem = listItem;
                            }
                        });

                        return selectedItem;
                    }

                }

                init();
            }
        };
    }
);
