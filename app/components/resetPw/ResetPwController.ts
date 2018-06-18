/// <reference path="../../shared/references.ts"/>
module tuho {
    'use strict';

    export interface ResetPwControllerInterface extends interfaces.ControllerInterface {
        invalidToken: boolean;
        password: string;
        password2: string;
        submitted: boolean;
    }

    export interface ResetPwScopeInterface {
        resetPwForm: any;
    }

    export class ResetPwController implements ResetPwControllerInterface {

        static $inject = [
            "PasswordService",
            "response",
            "$scope"
        ];

        public invalidToken: boolean;
        public serverError: boolean;
        public isLoading: boolean;
        public formError: boolean;
        public password: string;
        public password2: string;
        public submitted: boolean;

        constructor(private PasswordService: PasswordServiceInterface, private response: ng.IHttpPromiseCallbackArg<interfaces.TokenCheckResponseInterface>, private scope: ResetPwScopeInterface) {
            if (!response) {
                this.serverError = true;
                return;
            }
            var data = response.data;

            if (data.error == "TokenNotFound" || data.error == "TokenExpired" || !data.token) {
                this.invalidToken = true;
                return;
            }
            this.token = data.token;
            this.invalidToken = false;
            this.serverError = false;
        }

        changePw = (valid) => {
            if (valid == false) {
                this.formError = true;
                return;
            } else {
                if (this.comparePasswords(this.password, this.password2) == false) {
                    return;
                }

                this.isLoading = true;
                this.serverError = false;
                this.PasswordService.changePw(this.token, this.password, this.password2)
                    .then((data) => {
                        this.submitted = true;
                    })
                    .catch((err: ng.IHttpPromiseCallbackArg<any>) => {
                        if ((err.data.error == "TokenNotFound" || err.data.error == "TokenExpired") && err.status == 404) {
                            this.invalidToken = true;
                            return;
                        }
                        this.serverError = true;
                        console.error(err)
                    });
            }
        }

        comparePasswords = (pass, pass2) => {
            if (pass != pass2) {
                this.scope.resetPwForm.password2.$setValidity("missmatch", false);
                this.formError = true;
                return false;
            } else {
                this.scope.resetPwForm.password2.$setValidity("missmatch", true);
                this.formError = false;
                return true;
            }
        }

        private token: string;
    }

    var app = angular.module('tuho');
    app.controller('ResetPwController', ResetPwController);
}
;
