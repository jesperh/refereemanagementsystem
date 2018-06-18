/// <reference path="../../shared/references.ts"/>
module tissi {
    'use strict';

    export interface MainControllerInterface extends ng.IScope {
       user: interfaces.User;
    }

    export class MainController {

        static $inject = [
            "AuthorizationService",
            "authorize",
            "MainService",
            "$log",
            "UserService",
            "LoginService",
            "$window",
            "localStorageService",
            "$state"
        ];

        public user: interfaces.User;
        public isLoading: boolean;
        public localStorageWarning: boolean;

        constructor(
            AuthorizationService,
            authorize,
            private MainService,
            public $log,
            private UserService: services.UserServiceInterface,
            private LoginService: services.LoginServiceInterface,
            private $window: ng.IWindowService,
            private LocalStorageService: angular.local.storage.ILocalStorageService,
            private $state
        ) {
            this.$log = $log;
            this.isLoading = false;
            if(this.LocalStorageService.isSupported == false) {
                this.localStorageWarning = true;
            }
        }

        loggedin() {
            return this.UserService.isAuthenticated();
        }

        logout = () => {
            return this.LoginService.logout().then(() => {
                this.$state.go('home');
                this.$window.location.reload();
            });
        }
    }

    var app = angular.module('tissi');
    app.controller('MainController', MainController);
};
