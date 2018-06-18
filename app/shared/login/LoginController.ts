/// <reference path="../../shared/references.ts"/>
module tuho {
    'use strict';

    export class LoginController {

        public user: interfaces.User;
        public username: string;
        public password: string;
        public usernameError: boolean;
        public passwordError: boolean;

        static $inject = [
            "$scope",
            "MainService",
            "LoginService",
            "$uibModal",
            "UserService",
            "$state",
            "$timeout"
        ];

        constructor(private $scope: any,
                    private MainService,
                    private LoginService: services.LoginServiceInterface,
                    private $uibModal,
                    private UserService,
                    private $state: angular.ui.IStateService,
                    private $timeout: ng.ITimeoutService) {
        }

        open() {
            var modalInstance = this.$uibModal.open({
                animation: true,
                templateUrl: 'partials/loginTemplate.html',
                controller: 'LoginModalController',
                controllerAs: "lg",
                //size: size,
                resolve: {
                    items: function () {
                    }
                }
            });

            modalInstance.result.then((result) => {
                if (result == true) {
                } else {
                }

            }, () => {
            });
        }

        loggedin() {
            return this.UserService.isAuthenticated();
        }

        logout() {
            this.LoginService.logout().success(() => {
                this.UserService.authenticate(null);
                this.$timeout(() => {
                    this.$state.go('home');
                }, 500);
            }).error(function (err) {
                console.error(err);
            });
        }
    }

    var app = angular.module('tuho');
    app.controller('LoginController', LoginController);


    export class LoginModalController {

        public usernameError: boolean;
        public passwordError: boolean;
        public loginSucceeded: boolean;
        public isLoading: boolean;

        static $inject = [
            "$modalInstance",
            "LoginService",
            "$timeout",
            "UserService"
        ];

        constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
                    private LoginService: services.LoginService,
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
                    this.UserService.authenticate(user);
                    this.$timeout(() => {
                        this.isLoading = false;
                        this.$modalInstance.close(true);
                    }, 3000)
                })
                .error((err) => {
                    this.isLoading = false;
                    this.loginSucceeded = false;
                });


        }

        cancel() {
            this.$modalInstance.dismiss('cancel');
        }

    }

    var app = angular.module('tuho');
    app.controller('LoginModalController', LoginModalController);

}
;