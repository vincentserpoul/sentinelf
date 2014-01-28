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
        popup: function (name, identity, url, obj){
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
                    },
                    obj: function () {
                        return obj;
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
        },
        initValues: function (obj) {
            var savObj = angular.copy(obj);
            for (var item in obj) {
                if (obj[item] && obj[item].toinit) {
                    savObj.item = {};
                    obj[item].init(savObj, item);
                }
            }
            return savObj;
        },
        alert: function () {
            alert('123');
        }
 	}   
});

sentinelfApp.controller('popupCtrl', ['$scope', '$modalInstance', 'name', 'identity', 'obj', function($scope, $modalInstance, name, identity, obj){
    $scope.name = name;
    $scope.identity = identity;
    $scope.obj = obj;

    $scope.confirm = function () {
        $modalInstance.close();
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
}])