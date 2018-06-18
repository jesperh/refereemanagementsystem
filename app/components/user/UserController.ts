/// <reference path="../../shared/references.ts"/>
module tuho {
    'use strict';

    export class UserController {

        static $inject = [
            "UserService",
            "user",
            "$log",
            "$scope",
            "$timeout",
            "$state"
        ];


        public formError: boolean;
        public oldUser: interfaces.OldUser;
        public formSuccess: boolean;
        public serverError: boolean;
        public isLoading: boolean;

        constructor(private UserService: UserServiceInterface, private user, public $log, private scope, private $timeout, private $state) {

            this.isLoading = false;
            this.formError = false;
            this.serverError = false;
            this.formSuccess = false;
            this.oldUser = user.data;
        }

        submitForm = (valid) => {

            //if the user is setting a new password, check that an old password is also given
            if(this.oldUser.newPassword && this.oldUser.newPassword.length > 0 &&  (!this.oldUser.password || this.oldUser.password.length == 0)) {
                this.scope.editForm.password.$setValidity("nooldpassword", false);
                valid = false;
            } else {
                this.scope.editForm.password.$setValidity("nooldpassword", true);
            }

            if(valid == false) {
                this.formError = true;
                return;
            } else {
                this.isLoading = true;
                this.serverError = false;
                this.scope.editForm.email.$setValidity("emailtaken", true);

                this.UserService.updateUser(this.oldUser).success((addedUser:any) => {
                    this.isLoading = false;
                    this.formError = false;
                    this.formSuccess = true;

                    this.$timeout(() => {
                        this.isLoading = false;
                        this.$state.go('home');
                    }, 2000);
                }).error((err, status) => {

                    this.isLoading = false;
                    this.formError = true;

                    //notify the user in the UI
                    if(err.error == "email already taken") {
                        this.scope.editForm.email.$setValidity("emailtaken", false);
                    }

                    if(err.error == "OldPasswordInvalid") {
                        this.scope.editForm.password.$setValidity("invalidoldpassword", false);
                    }

                    if(err.error == "Not authorised" || status == 401) {
                        this.formError = false;
                        this.serverError = true;
                    }

                    else if(err.error == "ServerError" || err.error == "Invalid parameters" || status == 500) {
                        this.formError = false;
                        this.serverError = true;
                    }
                    return;
                });
            }
        }

        //this function is bound to email input's ng-change event.
        //When an email error is shown in UI and the user re-enters
        //value to this input, the error needs to be dismissed.
        //If we didn't do this, the form wouldn't validate and submit
        //woudn't happen.
        validateEmail() {
            if(!this.scope.editForm.email.$valid){
                this.scope.editForm.email.$setValidity("emailtaken", true);
            }
        }
        validatePassword() {
            if(!this.scope.editForm.password.$valid){
                this.scope.editForm.password.$setValidity("invalidoldpassword", true);
                this.scope.editForm.password.$setValidity("nooldpassword", true);
            }
        }
    }

    var app = angular.module('tuho');
    app.controller('UserController', UserController);
};
