'use strict';

sentinelfApp
.directive("editInputSelect"
    , function() {

        var editInputSelectTemplate =
            '<div ng-hide="editForm">' +
                '{{ selectedItem.label }} ' +
            '</div>' +
            '<div ng-show="editForm">' +
                '<select class="form-control input-sm" ng-model="selectedItem" ng-options="item.label for item in modelRefList" required></select>' +
            '</div>';

        return {
            restrict: 'EA',
            template: editInputSelectTemplate,
            scope: {
                uniqIdValue: '=',
                modelRefResource: '=',
                modelRefType: '@',
                editForm: '='
            },
            link: function(scope){

                function init(){

                    /* We have to wait for the resource to come back so we get its promise and move when it is there */
                    scope.modelRefResource.$promise.then(function(modelRefResult){
                        scope.modelRefList = modelRefResult.labels[scope.modelRefType];

                        /* Preselect the select box with the given value uniqIdValue */
                        scope.selectedItem = scope.findItemByUniqId(scope.modelRefList, scope.uniqIdValue);
                    });

                }

                /**
                 * findObjectById: Function to find the item (object) corresponding to the id or code inside a given list
                 *
                 * modelRefList     array   ie for countries {{code: "ABW", label: "Aruba"}, {code: "AFG", label: "Afghanistan"}...}
                 * uniqIdValue      object  ie for countries, 'IND', 'FRA', 'CHN'...
                 *
                 * return
                 * selectedItem        object  {code: "ABW", label: "Aruba"}
                **/
                scope.findItemByUniqId = function (modelRefList, uniqIdValue){

                    /* We only search for the preselected item if there is an actual preselected uniqIdValue */
                    if(uniqIdValue != '' && modelRefList != ''){
                        /* default selectedItem is the first one */
                        var selectedItem = modelRefList[0];
                        /* loop through the modelfRefList to find the item with the uniqIdValue */
                        angular.forEach(modelRefList, function(listItem){
                            /* if we find the uniqIdValue in the list, we put it inside selectedItem */
                            if(listItem['code'] == uniqIdValue){
                                selectedItem = listItem;
                            } else if(listItem['id'] == uniqIdValue){
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
