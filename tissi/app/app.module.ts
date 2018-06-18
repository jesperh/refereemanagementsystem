/// <reference path="shared/references.ts"/>
declare var _: any;
module tissi {
    'use strict';

    var app = angular.module('tissi', [
        'ngAnimate',
        'ngTouch',
        'ui.router',
        'ui.bootstrap',
        'ngMessages',
        'LocalStorageModule',
        "ab-base64"
    ]);

    app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) => {

        $urlRouterProvider.otherwise("/notfound");

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $stateProvider

            .state("main", {
                abstract: true,
                templateUrl: "/partials/tissi/mainView.html",
                controller: "MainController",
                controllerAs: "main",
                data: {
                    roles: []
                },
                resolve: {
                    AuthorizationService: "AuthorizationService",
                    authorize: ['AuthorizationService',
                        function(AuthorizationService) {
                            return AuthorizationService.authorize();
                        }
                    ],
                }
            })
            .state("home", {
                url: "/",
                parent: "main",
                templateUrl: "/partials/tissi/homeView.html",
                controller: "HomeController",
                controllerAs: "vm",
                data: {
                    roles: []
                }
            })
            .state("games", {
                url: "/games",
                parent: "main",
                templateUrl: "/partials/tissi/gamesView.html",
                controller: "GamesController",
                controllerAs: "vm",
                data: {
                    roles: ['user', 'admin']
                },
                resolve: {
                    GamesService: "GamesService",
                    pastGamesData: ['GamesService',
                        function(GamesService:tissi.services.GamesService) {
                            return GamesService.getPastGames();
                        }
                    ],
                }
            })

            .state("newgame", {
                url: "/newgame",
                parent: "main",
                templateUrl: "/partials/tissi/newGameView.html",
                controller: "NewGameController",
                controllerAs: "vm",
                data: {
                    roles: ['user', 'admin']
                }
            })

            .state("special", {
                url: "/special",
                parent: "main",
                templateUrl: "/partials/tissi/specialView.html",
                controller: "SpecialController",
                controllerAs: "vm",
                data: {
                    roles: ['user', 'admin']
                }
            })

            .state("error", {
                url: "/error",
                parent: "main",
                template: '<div class="list-group-item media game-item card-1 card-hover"><h3>Virhe</h3><p>Sinulla ei ole oikeuksia nähdä tätä sivua. Muistithan kirjautua sisään?</p><p><a href="/tissi">Palvelimella sattui jokin virhe :( Jos virhe toistuu, soita päätuomareille.</a></p></div>'
            })
            .state("denied", {
                url: "/denied",
                parent: "main",
                template: '<div class="list-group-item media game-item card-1 card-hover"><h3>Virhe</h3><p>Sinulla ei ole oikeuksia nähdä tätä sivua. Muistithan kirjautua sisään?</p><p><a href="/tissi">Palaa etusivulle</a></p></div>'
            })
            .state("notfound", {
                url: "/notfound",
                parent: "main",
                template: '<div class="list-group-item media game-item card-1 card-hover"><h3>Virhe</h3><p>Hakemaasi sivua ei löytynyt.</p><p><a href="/tissi">Palaa etusivulle</a></p></div>'
            });

        $locationProvider.html5Mode(true);

    }]);
    app.run(['$rootScope', '$state', '$stateParams', 'AuthorizationService', 'UserService',
        function($rootScope, $state, $stateParams, AuthorizationService, UserService) {

            $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;

                if (UserService.isIdentityResolved()) AuthorizationService.authorize();
            });

            $rootScope.$on('$stateChangeError',
                function(event, toState, toParams, fromState, fromParams, error) {
                    $state.go('error');
                });
        }
    ]);
};