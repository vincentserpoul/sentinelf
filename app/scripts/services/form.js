'use strict';
/*
/* a service to reset the object to original values if users do not confirm changes
*/
sentinelfApp.factory('formService', function($resource, $modal) {
 	return {
 		findObjectById : function (listObject, idObject){
            for(var i in listObject){
                if(listObject[i].id == idObject) {return listObject[i]};
            }
            return null;
        },
        findObjectByIdWithIdRef : function (listObject, idObject, idRef){
            for(var i in listObject){
                if(listObject[i][idRef] == idObject) {return listObject[i]};
            }
            return null;
        },
        findObjectByIdWithIdRefs : function (listObject, parameters) {
            for (var i in listObject) {
                var match = true;
                for (var item in parameters) 
                    if (listObject[i][item] != parameters[item]) match = false;
                if (match) return listObject[i];
            }
            return null;
        },
        findObjectByCode : function (listObject, codeObject){
            for(var i in listObject){
                if(listObject[i].code == codeObject) {return listObject[i]};
            }
            return null;
        },
        popup: function (name, identity,url){
            if( typeof(url) == 'undefined' ){
                url = 'popup.html'
            }
            var modalInstance = $modal.open({
                templateUrl: 'views/'+ url,
                controller: 'popupCtrl',
                resolve: {
                    name: function () {
                        return name;
                    },
                    identity: function () {
                        return identity;
                    }
                }
            });
            return modalInstance;
        },
        findInArray: function (arrayObj, id) {
            for (var i in arrayObj) {
                if (id == arrayObj[i].id)
                    return i; 
            }
            return -1;
        },
        copyProps: function (element1, element2) {
            for (var item in element1) {
                element2[item] = element1[item];
            }
        }
 	}   
});

sentinelfApp.controller('popupCtrl', ['$scope', '$modalInstance', 'name', 'identity', function($scope, $modalInstance, name, identity){
    $scope.name = name;
    $scope.identity = identity;

    $scope.confirm = function () {
        $modalInstance.close();
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
}])