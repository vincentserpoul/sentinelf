'use strict';

sentinelfApp.factory('crud', function (formService, AlertService, $injector) {
	
	function loadResources ($scope, obj) {
		switch (obj) {
			case 'event':
				if (!($scope.employers && $scope.employer_departments))
					$scope.loadEmployersAndDepartments(); 
				break;
			default:
				break;
		}
	}

	var objTemplates = {
		'event': {
			'view': 'views/events/eventView.html',
			'edit': 'views/events/eventEdit.html'
		},
	}

	var objLabels = {
		'event': 'label'
	}

	return {
		edit: function ($scope, obj) {
			// load necessary resources for selection
			loadResources($scope, obj);
			// load editing template
		    $scope[obj + 'Template'] = objTemplates[obj]['edit'];
		    // create obj clone
		    $scope['sav_' + obj] = {};
		    formService.copyProps($scope[obj], $scope['sav_' + obj]);
		},

		save: function ($scope, obj) {
	        /* Call the factory to update the new obj in db */
	        $injector.get(obj + 'Factory').update($scope[obj],
	            function (data) {
	                if (data) {
	                	$scope[obj] = data[obj];
	                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
	                }
	            }, function (error) {
	                if (error['data'])
	                    AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
	            }
	        );
	        // load back view template
	        $scope[obj + 'Template'] = objTemplates[obj]['view'];
		}, 

		cancelEdit: function ($scope, obj) {
			// Reset the data to what it was before the edit
        	formService.copyProps($scope['sav_' + obj], $scope[obj]);
			// load back view template
	        $scope[obj + 'Template'] = objTemplates[obj]['view'];
		},

		delete: function ($scope, obj) {
			var modalInstance = formService.popup(obj, $scope[obj][objLabels[obj]]);
			var params = {}; params[obj + 'Id'] = $scope[obj]['id'];

	        modalInstance.result.then(function(){
	            $injector.get(obj + 'Factory').delete(params,
	                function (data) {
	                    $scope[obj + 'sLazyloadFactory'][obj + 's'].splice(formService.findInArray($scope[obj + 'sLazyloadFactory'][obj + 's'], $scope[obj]['id']), 1);
	                    AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
	                }, function (error) {
	                    if (error['data'])
	                        AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
	                }
	            );
	        });
		},

		new: function ($scope, obj, preselectedValues) {
			loadResources($scope, obj);
			$scope['new_' + obj] = preselectedValues;
        	$('#collapse_new_' + obj).collapse('show');
		}, 

		create: function ($scope, obj) {
			/* Call the factory to update the new event in db */
	        $injector.get(obj + 'Factory').save($scope['new_' + obj],
	            function (data) {
	                $scope[obj + 'sLazyloadFactory'][obj + 's'].unshift(data[obj]);
	                AlertService.show({ "message": data['message'], "type": 'alert-success' }, true);
	            }, function (error) {
	                if (error['data']) AlertService.show({ "message": error['data']['message'], "type": 'alert-danger' }, false);
	            }
	        )
	        $('#collapse_new_' + obj).collapse('hide');
		}, 

		cancelNew: function (obj) {
			$('#collapse_new_' + obj).collapse('hide');
		}
	}
})