/// <reference path="../../shared/references.ts"/>
module tissi.services {
    'use strict';

    export interface IHomeService {
    }

    export class HomeService implements IHomeService {

        static $inject = [
            "$http",
            "$log"
        ];

        constructor(private $http: any, private $log: any) {
        }
    }

    var module = angular.module('tissi');
    module.service("HomeService", HomeService);
}