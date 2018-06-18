module tuho.admin.controllers {
    'use strict';

    export class WorkersListController {

        static $inject = [
            "WorkersService",
            "workers"
        ];

        private workersList: any;

        constructor(private RefereesService: any, workers: any) {
            this.workersList = workers.data;
        }
    }

    var app = angular.module('tuho');
    app.controller('WorkersListController', WorkersListController);
};

