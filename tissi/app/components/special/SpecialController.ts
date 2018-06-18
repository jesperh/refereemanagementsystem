/// <reference path="../../shared/references.ts"/>
module tissi {
    'use strict';


    export class SpecialController {



        static $inject = [
            "UserService"
        ];

        constructor(
            private UserService: any
        ) {

        }


    }
    var app = angular.module('tissi');
    app.controller('SpecialController', SpecialController);

};

