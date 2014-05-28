'use strict';

sentinelfApp.factory('paymentFactory', ['$resource', 'SENTINEL_API_END_POINT', function($resource, SENTINEL_API_END_POINT) {
    return $resource( SENTINEL_API_END_POINT + '/payment');
}]);
