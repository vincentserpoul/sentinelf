'use strict';

sentinelfApp.factory('clientDepartmentsFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {

    var clientDepartmentsResource = $resource( SENTINEL_API_END_POINT + '/client_department/:clientDepartmentId:subResource',
        {
            clientDepartmentId: '@id',
            subResource: '@subResource'
        },
        {
            'get': {method:'GET', cache: true},
            'update': {method:'PUT', params:{clientDepartmentId: '@id'}},
            'delete': {method:'DELETE', params:{clientDepartmentId: '@id'}},
            'clients_departments': {method:'GET', cache: true, params:{subResource: 'clients_departments'}}
        }
    );
    return clientDepartmentsResource;

}]);
