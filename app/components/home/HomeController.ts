/// <reference path="../../shared/references.ts"/>

module tuho {
    'use strict';

    export interface IHomeController extends ng.IScope {
        vm: HomeController;
    }

    export class HomeController {

        static $inject = [
            "HomeService",
            "homeNews"
        ];

        public news: interfaces.News[];

        constructor(private HomeService: any, homeNews: interfaces.News[]) {
            this.news = homeNews;
        }

        willRefereeThisYear = () => {

        }
    }

    var app = angular.module('tuho');

    app.controller('HomeController', HomeController);
};

