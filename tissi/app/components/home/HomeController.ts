/// <reference path="../../shared/references.ts"/>
module tissi {
    'use strict';


    export class HomeController {

        public usernameError: boolean;
        public passwordError: boolean;
        public loginSucceeded: boolean;
        public isLoading: boolean;

        static $inject = [
            "LoginService",
            "$timeout",
            "UserService"
        ];

        constructor(private LoginService: services.LoginService,
                    private $timeout: ng.ITimeoutService,
                    private UserService: any) {
            this.loginSucceeded = undefined;
            this.isLoading = false;
        }

        login(username, password) {

            this.isLoading = true;
            this.usernameError = false;
            this.passwordError = false;

            if (!username) {
                this.usernameError = true;
                this.isLoading = false;
                return;
            }
            if (!password) {
                this.passwordError = true;
                this.isLoading = false;
                return;
            }

            this.LoginService
                .login(username, password)
                .success((user) => {
                    this.loginSucceeded = true;

                    this.$timeout(() => {
                        this.UserService.authenticate(user);
                        this.isLoading = false;
                    }, 1500)
                })
                .error((err) => {
                    this.isLoading = false;
                    this.loginSucceeded = false;
                    console.log(err.error);
                });
        }

        loggedin() {
            return this.UserService.isAuthenticated();
        }
    }

    var app = angular.module('tissi');
    app.controller('HomeController', HomeController);
}
;

