/// <reference path="../../shared/references.ts"/>

module tuho {
    'use strict';

    export class RegisterController {

        static $inject = [
            "RegisterService",
            "$timeout",
            "$scope",
            "$state",
            "UserService"
        ];

        public $timeout: ng.ITimeoutService;
        public $state: angular.ui.IStateService;
        public formError: boolean;
        public newUser: interfaces.NewUser;
        public scope: any;
        public formSuccess: boolean;
        public serverError: boolean;
        public isLoading: boolean;

        constructor(RegisterService: any, timeout:ng.ITimeoutService, $scope, $state, private UserService) {

            this.RegisterService = RegisterService;
            this.$timeout = timeout,
            this.formError = false;
            this.scope = $scope;
            this.$state = $state;
            this.serverError = false;
            this.formSuccess = false;
        }

        submitForm = (valid) => {
            this.isLoading = true;
            if(valid == false) {
                this.formError = true;
            } else {
                this.serverError = false;
                this.scope.registerForm.username.$setValidity("usernametaken", true);
                this.scope.registerForm.email.$setValidity("emailtaken", true);

                this.RegisterService.registerUser(this.newUser).success((addedUser:any) => {
                    this.isLoading = false;
                    this.formError = false;
                    this.formSuccess = true;
                    this.UserService.authenticate({id:addedUser.id, email: addedUser.email, role: addedUser.role, interested:true});
                    this.$timeout(() => {
                        this.$state.go('home');
                    }, 3000);
                }).error((err) => {

                    this.isLoading = false;
                    this.formError = true;

                    if(err.error == "username already taken") {
                        this.formError = true;

                        this.scope.registerForm.username.$setValidity("usernametaken", false);
                    }

                    if(err.error == "email already taken") {
                        this.scope.registerForm.email.$setValidity("emailtaken", false);
                    }

                    if(err.error == "ServerError") {
                        this.formError = false;
                        this.serverError = true;
                    }
                    return;
                });
            }
        }

        validateUsername() {
            if(!this.scope.registerForm.username.$valid){
                this.scope.registerForm.username.$setValidity("usernametaken", true);
            }
        }
        validateEmail() {
            if(!this.scope.registerForm.email.$valid){
                this.scope.registerForm.email.$setValidity("emailtaken", true);
            }
        }

        private RegisterService: any;
    }

    var app = angular.module('tuho');
    app.controller('RegisterController', RegisterController);
};

