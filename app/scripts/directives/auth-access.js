'use strict';

sentinelfApp
.directive('accessLevel', ['AuthenticationService', function(AuthenticationService) {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var prevDisp = element.css('display')
                , permissions;
                
            $scope.user = AuthenticationService.user;
            $scope.$watch('user', function(user) {
                updateCSS();
            }, true);
            
            attrs.$observe('accessLevel', function(al) {
                if(al) permissions = $scope.$eval(al);
                updateCSS();
            });

            function updateCSS() {
                if(permissions) {
                    if(!AuthenticationService.authorize(permissions))
                        element.css('display', 'none');
                    else
                        element.css('display', prevDisp);
                }
            }
        }
    };
}]);

sentinelfApp.directive('activeNav', ['$location', function($location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var nestedA = element.find('a')[0];
            var path = nestedA.href;

            scope.location = $location;
            scope.$watch('location.absUrl()', function(newPath) {
                if (path === newPath) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });
        }

    };

}]);