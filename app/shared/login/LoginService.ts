/// <reference path="../../shared/references.ts"/>
module tuho.services {
    'use strict';

    export interface LoginServiceInterface {
        login(username: string, password: string): ng.IHttpPromise<any>;

        logout(): ng.IHttpPromise<any>;
    }

    export class LoginService implements LoginServiceInterface {
        static $inject = [
            "$http",
            "$log"
        ];

        constructor(private $http: any, private $log: any) {
        }

        login(username, password) {
            return this.$http.post("/api/user/login", {username: username, password: password});
        }

        logout() {
            return this.$http.post("/api/user/logout");
        }
    }

    var module = angular.module('tuho');
    module.service("LoginService", LoginService);
}