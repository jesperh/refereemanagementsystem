/// <reference path="../shared/references.ts"/>
module tuho {
    'use strict';

    export interface PasswordServiceInterface {
        resetPw(usernameOrEmail: string): ng.IPromise<any>;
        checkToken(token: string): ng.IPromise<any>;
        changePw(token: string, password: string, password2: string)
    }

    export class PasswordService implements PasswordServiceInterface {
        static $inject = [
            "$http",
            "$q",
        ];

        constructor(private $http: any, private $q: ng.IQService) {
        }

        resetPw(usernameOrEmail: string) {
            return this.$http.post("/api/user/forgot/" + usernameOrEmail);
        }

        checkToken = (res) => {
            if (!res || !res.token) {
                return;
            }
            return this.$http.get("/api/user/resetpw/" + res.token);
        }

        changePw = (token, password, password2) => {
            var data = {
                token: token,
                password: password,
                password2: password2
            }
            return this.$http.put("/api/user/resetpw", data);
        }
    }

    var module = angular.module('tuho');
    module.service("PasswordService", PasswordService);
}