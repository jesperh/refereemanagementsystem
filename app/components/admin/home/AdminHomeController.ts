/// <reference path="../../../shared/references.ts"/>

module tuho {
    'use strict';

    export class AdminHomeController {

        static $inject = [
            "AdminService"
        ];

        constructor(private AdminService) {

        }
    }

    var app = angular.module('tuho');
    app.controller('AdminHomeController', AdminHomeController);
};

