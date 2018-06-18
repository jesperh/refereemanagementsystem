/// <reference path="../../../shared/references.ts"/>
module tuho.admin.services {
    'use strict';

    export class WorkersService // implements RefereeServiceInterface
    {

        static $inject = [
            "$http",
            "$log"
        ];

        constructor(private $http: any, private $log: any) {
        }

        public getWorkers() {
            return this.$http.get("/api/admin/workers").success(function (workers) {
                return workers;
            }).error(function (err) {
                return err;
            });
        }
    }

    var module = angular.module('tuho');
    module.service("WorkersService", WorkersService);
}