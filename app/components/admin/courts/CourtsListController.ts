module tuho.admin.controllers {
    'use strict';

    export class CourtsListController {

        static $inject = [
            "CourtsService",
            "courts"
        ];

        private courtsList: any;

        constructor(private CourtsService: any, courts: any) {
            this.courtsList = courts.data;
        }
    }

    var app = angular.module('tuho');
    app.controller('CourtsListController', CourtsListController);
};

