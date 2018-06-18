/// <reference path="../../shared/references.ts"/>
module tuho {
    'use strict';

    export interface ForgotControllerInterface extends interfaces.ControllerInterface {
        userNotFound: boolean;
        invalidCredential: boolean;
        resetSucceeded: boolean;
        noCredential: boolean;

        resetPw(usernameOrEmail: string): void;
    }

    export class ForgotController implements ForgotControllerInterface {
        static $inject = [
            "PasswordService"
        ];

        public userNotFound: boolean;
        public invalidCredential: boolean;
        public serverError: boolean;
        public resetSucceeded: boolean;
        public noCredential: boolean;
        public isLoading: boolean;

        constructor(private PasswordService: PasswordServiceInterface) {
            this.userNotFound = false;
            this.invalidCredential = false;
            this.serverError = false;
        }

        resetPw = (usernameOrEmail) => {
            this.isLoading = true;
            if (!usernameOrEmail) {
                this.noCredential = true;
                return;
            }
            this.PasswordService.resetPw(usernameOrEmail).then(this.resetSuccess, this.resetFailure);
            return;
        }

        private resetSuccess = () => {
            this.isLoading = false;
            this.noCredential = false;
            this.invalidCredential = false;
            this.serverError = false;
            this.resetSucceeded = true;

            return;
        }

        private resetFailure = (response: ng.IHttpPromiseCallbackArg<any>) => {
            this.resetSucceeded = false;
            this.isLoading = false;
            if (response.status == 400) {
                this.invalidCredential = true;
                return;
            }
            if (response.status == 500) {
                this.serverError = true;
                return;
            }
            return;
        }
    }

    var app = angular.module('tuho');
    app.controller('ForgotController', ForgotController);
}
;
