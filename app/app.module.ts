/// <reference path="shared/references.ts"/>
declare var _: any;
module tuho {
    'use strict';

    var app = angular.module('tuho', [
        'ngAnimate',
        'ui.router',
        'ui.bootstrap',
        'ngMessages',
        'nemLogging',
        'ui-leaflet'
    ]);

    app.constant("REFEREESTATUSES", ["Kentällä", "Rikki", "Kuollut", "Valmis", "Reservissä"])
    app.constant("POWERBANKSTATUSES", ['Luovutettu', 'Hukattu', 'Palautettu', 'Ostettu', 'Hajonnut'])
    app.constant("PAWNSTATUSES", ['Maksettu', 'Palautettu', 'EiPalauteta'])

    app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", ($stateProvider, $urlRouterProvider, $locationProvider) => {

        $urlRouterProvider.otherwise("/notfound");

        $stateProvider
            .state("main", {
                abstract: true,
                templateUrl: "/partials/mainView.html",
                controller: "MainController",
                controllerAs: "main",
                data: {
                    roles: []
                },
                resolve: {
                    AuthorizationService: "AuthorizationService",
                    authorize: ['AuthorizationService',
                        function (AuthorizationService) {
                            return AuthorizationService.authorize();
                        }
                    ],
                }
            })
            .state("admin", {
                abstract: true,
                templateUrl: "/partials/adminView.html",
                data: {
                    roles: ['admin']
                },
                resolve: {
                    AuthorizationService: "AuthorizationService",
                    authorize: ['AuthorizationService',
                        function (AuthorizationService) {
                            return AuthorizationService.authorize();
                        }
                    ],
                }
            })
            .state("home", {
                url: "/",
                parent: "main",
                templateUrl: "/partials/homeView.html",
                controller: "HomeController",
                controllerAs: "home",
                data: {
                    roles: []
                },
                resolve: {
                    HomeService: "HomeService",
                    homeNews: ["HomeService", (HomeService) => {
                        return HomeService.getNews();
                    }]
                }
            })
            .state("register", {
                url: "/register",
                parent: "main",
                controller: "RegisterController",
                controllerAs: "rg",
                templateUrl: "/partials/registerView.html",
                data: {
                    roles: []
                },
            })
            .state("user", {
                url: "/user",
                parent: "main",
                controller: "UserController",
                controllerAs: "rg",
                templateUrl: "/partials/userView.html",
                data: {
                    roles: ["user", "admin"]
                },
                resolve: {
                    UserService: "UserService",
                    user: ['UserService',
                        function (UserService) {
                            return UserService.getUserForEdit();
                        }
                    ],
                }
            })
            .state("adminhome", {
                url: "/admin",
                parent: "main",
                controller: "AdminHomeController",
                controllerAs: "vm",
                templateUrl: "/partials/adminHomeView.html",
                data: {
                    roles: ["admin"]
                }
            })
            .state("adminhome2", {
                url: "/admin/",
                parent: "main",
                controller: "AdminHomeController",
                controllerAs: "vm",
                templateUrl: "/partials/adminHomeView.html",
                data: {
                    roles: ["admin"]
                }
            })
            .state("users", {
                url: "/admin/users",
                parent: "admin",
                controller: "UsersController",
                controllerAs: "vm",
                templateUrl: "/partials/usersList.html",
                data: {
                    roles: ['admin']
                },
                resolve: {
                    AdminService: "AdminService",
                    users: ['AdminService',
                        function (AdminService) {
                            return AdminService.getUsers();
                        }
                    ],
                }
            })
            .state("referees", {
                url: "/admin/referees",
                parent: "admin",
                controller: "RefereesListController",
                controllerAs: "vm",
                templateUrl: "/partials/refereesList.html",
                data: {
                    roles: ['admin']
                },
                resolve: {
                    RefereeService: "RefereesService",
                    referees: ['RefereesService',
                        function (RefereesService) {
                            return RefereesService.getReferees();
                        }
                    ],
                    CourtsService: "CourtsService",
                    courts: ['CourtsService',
                        function (CourtsService) {
                            return CourtsService.getCourts();
                        }
                    ],

                }
            })
            .state("workers", {
                url: "/admin/workers",
                parent: "admin",
                controller: "WorkersListController",
                controllerAs: "vm",
                templateUrl: "/partials/workersList.html",
                data: {
                    roles: ['admin']
                },
                resolve: {
                    WorkersService: "WorkersService",
                    workers: ['WorkersService',
                        function (WorkersService) {
                            return WorkersService.getWorkers();
                        }
                    ],
                }
            })
            .state("tournaments", {
                url: "/admin/tournaments/list",
                parent: "admin",
                controller: "TournamentsListController",
                controllerAs: "vm",
                templateUrl: "/partials/tournamentsList.html",
                data: {
                    roles: ['admin']
                },
                resolve: {
                    TournamentsService: "TournamentsService",
                    tournaments: ['TournamentsService',
                        function (TournamentsService) {
                            return TournamentsService.getTournaments();
                        }
                    ],
                }
            })
            .state("addtournament", {
                url: "/admin/tournaments/add",
                parent: "admin",
                controller: "TournamentsAddController",
                controllerAs: "vm",
                templateUrl: "/partials/addTournamentView.html",
                data: {
                    roles: ['admin']
                },
                resolve: {}
            })
            .state("courts", {
                url: "/admin/courts/list",
                parent: "admin",
                controller: "CourtsListController",
                controllerAs: "vm",
                templateUrl: "/partials/courtsListView.html",
                data: {
                    roles: ['admin']
                },
                resolve: {
                    CourtsService: "CourtsService",
                    courts: ['CourtsService',
                        function (CourtsService) {
                            return CourtsService.getCourts();
                        }
                    ],
                }
            })
            .state("map", {
                url: "/admin/map",
                parent: "",
                controller: "MapController",
                controllerAs: "vm",
                templateUrl: "/partials/mapView.html",
                data: {
                    roles: ['admin']
                },
                resolve: {
                    CourtsService: "CourtsService",
                    courts: ['CourtsService',
                        function (CourtsService) {
                            return CourtsService.getCourts();
                        }
                    ],
                    RefereeService: "RefereesService",
                    referees: ['RefereesService',
                        function (RefereesService) {
                            return RefereesService.getReferees();
                        }
                    ],
                }
            })
            .state("addcourt", {
                url: "/admin/courts/add",
                parent: "admin",
                controller: "CourtsAddController",
                controllerAs: "vm",
                templateUrl: "/partials/addCourtView.html",
                data: {
                    roles: ['admin']
                },
                resolve: {}
            })
            .state("forgot", {
                url: "/forgot",
                parent: "main",
                controller: "ForgotController",
                controllerAs: "vm",
                templateUrl: "/partials/forgotView.html",
                data: {
                    roles: []
                }
            })
            .state("reset", {
                url: "/reset/:token",
                parent: "main",
                controller: "ResetPwController",
                controllerAs: "vm",
                templateUrl: "/partials/resetPwView.html",
                data: {
                    roles: []
                },
                resolve: {
                    PasswordService: "PasswordService",
                    response: ['PasswordService', "$stateParams",
                        function (PasswordService, $stateParams) {
                            return PasswordService.checkToken($stateParams);
                        }
                    ],
                }
            })
            .state("error", {
                url: "/error",
                parent: "main",
                template: '<div class="row"> <div class="col-md-12 header-bg" style="padding:0;"> <div class="tuho-box-heading"><h3>Virhe</h3> </div> <div class="tuho-full-width-box">Palvelimella sattui jokin virhe :( Jos virhe toistuu, ota yhteyttä example@example.com </div></div></div>'
            })
            .state("denied", {
                url: "/denied",
                parent: "main",
                template: '<div class="row"> <div class="col-md-12 header-bg" style="padding:0;"> <div class="tuho-box-heading"><h3>Virhe</h3> </div> <div class="tuho-full-width-box">Sinulla ei ole oikeuksia nähdä tätä sivua. Muistithan kirjautua sisään?</div></div></div>'
            })
            .state("notfound", {
                url: "/notfound",
                parent: "main",
                template: '<div class="row"> <div class="col-md-12 header-bg" style="padding:0;"> <div class="tuho-box-heading"><h3>Virhe</h3> </div> <div class="tuho-full-width-box">Hakemaasi sivua ei löytynyt</div></div></div>'
            });

        $locationProvider.html5Mode(true);

    }]);
    app.run(['$rootScope', '$state', '$stateParams', 'AuthorizationService', 'UserService',
        function ($rootScope, $state, $stateParams, AuthorizationService, UserService) {

            $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;

                if (UserService.isIdentityResolved()) AuthorizationService.authorize();
            });

            $rootScope.$on('$stateChangeError',
                function (event, toState, toParams, fromState, fromParams, error) {
                    $state.go('error');
                });
        }
    ]);
}
;