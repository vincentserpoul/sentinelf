'use strict';

sentinelfApp.factory('crud', function (formService, AlertService, $injector) {
	return {
		// call this function when users press editing button 
		edit: function ($scope, obj, loadResourcesFn) {
			// load necessary resources for selection
			if (loadResourcesFn) loadResourcesFn();
			// load editing template
		    $scope[obj + 'Template'] = $scope.editTemplate;
		    // create obj clone
		    $scope['sav_' + obj] = {};
		    formService.copyProps($scope[obj], $scope['sav_' + obj]);
		},

		// call this function when users save the edited obj (confirm editing)
		save: function ($scope, obj) {
	        /* Call the factory to update the new obj in db */
	        $injector.get(obj + 'Factory').update($scope[obj],
	        	// if success, set the obj to be the edited obj
	        	// and show success message
	            function (data) {
	                if (data) {
	                	$scope[obj] = data[obj];
	                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
	                }
	            // else show error message
	            }, function (error) {
	                if (error['data'])
	                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
	            }
	        );
	        // load back view template
	        $scope[obj + 'Template'] = $scope.viewTemplate;
		}, 

		// call this function when users dont want to edit obj
		cancelEdit: function ($scope, obj) {
			// Reset the data to what it was before the edit
        	formService.copyProps($scope['sav_' + obj], $scope[obj]);
			// load back view template
	        $scope[obj + 'Template'] = $scope.viewTemplate;
		},

		// call this function when users want to delete obj
		delete: function ($scope, obj, objLabel, notLazyLoad) {
			// load a modal asking users to confirm the deletion
			var modalInstance = formService.popup(obj, $scope[obj][objLabel]);
			var params = {}; params[obj + 'Id'] = $scope[obj]['id'];

			// if users confirm deletion, remove the obj from the obj list
	        modalInstance.result.then(function(){
	            $injector.get(obj + 'Factory').delete(params,
	                function (data) {
	                	// find obj in the obj list and remove it
	                	if (notLazyLoad)
	                    	$scope[obj + 's'].splice(formService.findInArray($scope[obj + 's'], $scope[obj]['id']), 1);
	                    else 
	                    	$scope[obj + 'sLazyloadFactory'][obj + 's'].splice(formService.findInArray($scope[obj + 'sLazyloadFactory'][obj + 's'], $scope[obj]['id']), 1);
	                    // show success message
	                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
	                }, function (error) {
	                	// show error message
	                    if (error['data'])
	                        AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
	                }
	            );
	        });
		},

		// call this function when users press add/new button
		new: function ($scope, obj, preselectedValues, loadResourcesFn) {
			if (loadResourcesFn) loadResourcesFn();
			$scope['new_' + obj] = preselectedValues;
			$scope.showNew = true;
		}, 

		// call this function when users confirm the new obj
		create: function ($scope, obj, notLazyLoad) {
			/* Call the factory to update the new event in db */
	        $injector.get(obj + 'Factory').save($scope['new_' + obj],
	            function (data) {
	            	// add obj into obj list
	            	if (notLazyLoad)
	                	$scope[obj + 's'].unshift(data[obj]);	                	
	                else
	                	$scope[obj + 'sLazyloadFactory'][obj + 's'].unshift(data[obj]);
	                // show success message
	                AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
	            }, function (error) {
	            	// show error message
	                if (error['data']) AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
	            }
	        )
	        $scope.showNew = false;
		}, 

		// call this function when users dont want to create the new obj
		cancelNew: function ($scope) {
			$scope.showNew = false;
		}
	}
})