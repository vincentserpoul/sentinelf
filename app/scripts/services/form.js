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
            return listObject[0];
        },
        findObjectByCode : function (listObject, codeObject){
            for(var i in listObject){
                if(listObject[i].code == codeObject) {return listObject[i]};
            }
            return listObject[0];
        },
        popup: function (name, identity){
            var modalInstance = $modal.open({
                templateUrl: 'views/popup.html',
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