window.flank = angular.module('flank', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'ngAnimate'])
    .config(['$routeProvider', '$locationProvider', '$httpProvider',
        function($routeProvider, $locationProvider, $httpProvider) {
            $routeProvider
                .when('/', {
                    controller: 'AppCtrl',
                    // templateUrl: '/templates/dashboard.html',
                    reloadOnSearch: false
                })
                .when('/incent/:emailId',{
                    templateUrl: '/templates/incentive/landingPage.html',
                    controller: 'landingPageCtrl',
                    reloadOnSearch: false,
                })
                .when('/thankyou',{
                    templateUrl: '/partials/gratification-page.html',
                    // controller: 'gratificationPageCtrl',
                    reloadOnSearch: false,
                })
                .otherwise({
                    redirectTo: '/'
                });

            //catch all http requests
            // $httpProvider.interceptors.push('LoadingInterceptor');

            // $locationProvider.html5Mode(true);
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        }
    ]);
