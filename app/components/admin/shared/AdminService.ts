/// <reference path="../../../shared/references.ts"/>
module tuho.admin.services {
    'use strict';

    export interface AdminServiceInterface {
    }

    export class AdminService implements AdminServiceInterface {
        static $inject = [
            "$http",
            "$log"
        ];

        constructor(private $http: any, private $log: any) {
        }

        public getUsers() {
            return this.$http.get("/api/admin/users").success(function (users) {
                return users;
            }).error(function (err) {
                console.log(err);
                return err;
            });
        }
    }

    var module = angular.module('tuho');
    module.service("AdminService", AdminService);
}