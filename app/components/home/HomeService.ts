/// <reference path="../../shared/references.ts"/>
module tuho.services {
    'use strict';

    export interface IHomeService {
        getNews(): interfaces.News[];
    }

    export class HomeService implements IHomeService {

        static $inject = [
            "$http",
            "$log"
        ];

        constructor(private $http: any, private $log: any) {
        }

        public getNews() {
            return [{title: "MOROOO", id: 0, body: "testi"}];
        }
    }

    var module = angular.module('tuho');
    module.service("HomeService", HomeService);
}