'use strict';

sentinelfApp.controller('GroupsCtrl', ['$scope', '$dialog', 'groupsFactory', 'UsersGroupsService', function($scope, $dialog, groupsFactory, UsersGroupsService){
	
	$scope.addGroup = function(){
		var opts = {
            backdrop: false,
            keyboard: true,
            backdropClick: false,
            templateUrl:  'views/administration/groups/groupForm.html', // OR: templateUrl: 'path/to/view.html',
            controller: 'GroupAddCtrl',
            resolve: {
            	permissions: function(){
            		return {
            			'permissions': $scope.permissions
            		};
            	}
            }
        };

        var d = $dialog.dialog(opts);

        d.open().then(
            function(data){
            	if(data && data['error'] == false){
            		$scope.$parent.$parent.groups = data['groups'];
            		UsersGroupsService.merge($scope.$parent.$parent.users, $scope.$parent.$parent.groups);
            	}
            }
        );
	}

	$scope.editGroup = function(group){
		groupsFactory.update(group, function(data){
			if(data && data['error'] == false){
				$scope.$parent.$parent.groups = data['groups'];
				UsersGroupsService.merge($scope.$parent.$parent.users, $scope.$parent.$parent.groups);
			}
		})
	}

	/* Delete group button for each group */
    $scope.deleteGroup = function(group){

        var name = "Delete group";
        var msg = "Are you sure you want to delete group "
                    + group.name + "?";

        var btns = [{result: 'cancel', label: 'Cancel'}, {result: 'confirm', label: 'Confirm', cssClass: 'btn-primary'}];

        $dialog.messageBox(name, msg, btns)
        .open()
        .then(function(result){
            if(result == 'confirm'){
                groupsFactory.delete({groupId:group.id},
                    function(data){
                        if(data && data['error'] == false){
                        	$scope.$parent.$parent.groups = data['groups'];
                        	UsersGroupsService.merge($scope.$parent.$parent.users, $scope.$parent.$parent.groups);
                        } else {
                            console.log(data['error']);
                        }
                    }
                );
            }
        });
    }


    //edit name of group
    $scope.editName = function(group){
        group.readonly = !group.readonly;
    }
}]);

sentinelfApp.controller('GroupAddCtrl', ['$scope', 'dialog', 'groupsFactory', 'permissions', function($scope, dialog, groupsFactory, permissions){
	var groupPermissions = {};

	for(var i = 0; i < permissions.permissions.length; i++){
		groupPermissions[permissions.permissions[i]] = {
			'name': permissions.permissions[i],
			'isPermitted': false
		}
	}

	$scope.formGroup = {
		'name': 'New Group\'s Name',
		'permissions': groupPermissions
	}

	$scope.saveDialog = function(group){
		groupsFactory.save($scope.formGroup, function(data){
			dialog.close(data);
		})
	}

	$scope.closeDialog = function(){
		dialog.close();
	}
}])