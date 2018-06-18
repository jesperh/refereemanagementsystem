module tuho.admin.controllers {
    'use strict';

    export class TournamentsListController {

        static $inject = [
            "TournamentsService",
            "tournaments"
        ];

        private tournamentsList: any;

        constructor(private TournamentsService: any, tournaments: any) {
            this.tournamentsList = tournaments.data;
        }
    }

    var app = angular.module('tuho');
    app.controller('TournamentsListController', TournamentsListController);
};

