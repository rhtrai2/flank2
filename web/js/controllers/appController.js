flank.controller('appCtrl', function ($scope, $window, $sce, $route, $location, $rootScope, $http, $templateCache) {

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (typeof(current) !== 'undefined'){
            $templateCache.remove(current.templateUrl);
        }
    });

    console.log('inside');

});
