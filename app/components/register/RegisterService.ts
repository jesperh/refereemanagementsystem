/// <reference path="../../shared/references.ts"/>
module tuho.services {
    'use strict';

    export interface RegisterServiceInterface {
        registerUser(user: interfaces.NewUser): ng.IHttpPromise<any>;
    }

    export class RegisterService implements RegisterServiceInterface {
        static $inject = [
            "$http",
            "$log"
        ];

        constructor(private $http: ng.IHttpService, private $log: ng.ILogService) {
        }

        public registerUser(user: any) {
            return this.$http.post("/api/user", user);
        }
    }

    var module = angular.module('tuho');
    module.service("RegisterService", RegisterService);
}