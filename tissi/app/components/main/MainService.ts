/// <reference path="../../shared/references.ts"/>
module tissi
{
    'use strict';

    export interface MainServiceInterface {
        getUser(): void;
        user: any;
    }

    export class MainService
    {
        static $inject = [
            "$http",
            "$log",
        ];

        private user: any;

        constructor(private $http: any, private $log: any) {
        }
    }

    var module = angular.module('tissi');
    module.service("MainService", MainService);
}