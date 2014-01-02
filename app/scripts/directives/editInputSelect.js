'use strict';

sentinelfApp
.directive("editInputSelect"
    , function() {

        var editInputSelectTemplate =
            '<div ng-hide="editForm">' +
                '{{ ngModel[label] }} ' +
            '</div>' +
            '<div ng-show="editForm">' +
                '<select class="form-control input-sm" ng-model="ngModel" ng-options="item[label] for item in modelRefList | filter: filterParams" required></select>' +
            '</div>';

        return {
            restrict: 'EA',
            template: editInputSelectTemplate,
            scope: {
                uniqIdValue: '=',
                initLabel: '@',
                altLabel: '@',
                altRef: '@',
                modelRefResource: '=',
                modelRefType: '@',
                editForm: '=',
                ngModel: '=',
                filterKey: '@',
                filterVarId: '=',
                filterVar: '='
            },
            link: function (scope) {
                scope.label = scope.altLabel ? scope.altLabel : 'label';

                if (!scope.ngModel) {
                    scope.ngModel = {'toinit':true};
                    scope.ngModel[scope.label] = scope.initLabel;

                    scope.ngModel.init = function (savObj, item) {
                        if (scope.filterKey) {scope.filterParams = {}; scope.filterParams[scope.filterKey] = scope.filterVarId}

                        /* We have to wait for the resource to come back so we get its promise and move when it is there */
                        scope.modelRefResource.$promise.then(function(modelRefResult){
                            
                            if (!scope.altRef) {
                                scope.modelRefList = modelRefResult.labels[scope.modelRefType];
                            } else if (scope.altRef == 'none') {
                                scope.modelRefList = modelRefResult[scope.modelRefType];    
                            } else {
                                scope.modelRefList = modelRefResult[scope.altRef][scope.modelRefType];
                            }

                            /* Preselect the select box with the given value uniqIdValue */
                            scope.ngModel = scope.findItemByUniqId(scope.modelRefList, scope.uniqIdValue);
                            if (savObj) savObj[item] = scope.ngModel;
                        });
                    }
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
                        var selectedItem = null;
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
                
                scope.$watch('filterVar', function (oldValue, newValue) {
                    if (scope.filterVar) {
                        scope.filterParams[scope.filterKey] = scope.filterVar;
                    }
                }) 

                //init();
            }
        };
    }
);
