/// <reference path="../../../shared/references.ts"/>

module tuho {
    'use strict';

    export class TournamentsAddController {
        static $inject = [
            "TournamentsService",
            "$scope",
            "$state",
            "UserService"
        ];

        public $timeout: ng.ITimeoutService;
        public $state: angular.ui.IStateService;
        public formError: boolean;
        public tournament: any;
        public scope: any;
        public formSuccess: boolean;
        public serverError: boolean;
        public isLoading: boolean;

        constructor(private TournamentsService: any, $scope, $state, private UserService) {
            this.formError = false;
            this.scope = $scope;
            this.$state = $state;
            this.serverError = false;
            this.formSuccess = false;
        }

        submitForm = (valid) => {
            if (!this.tournament) {
                this.formError = true;
                return;
            }
            this.isLoading = true;

            if (valid == false) {
                this.formError = true;
            } else {
                this.serverError = false;

                this.TournamentsService.addTournament(this.tournament).then((tournament: any) => {
                    this.isLoading = false;
                    this.formError = false;
                    this.formSuccess = true;
                }).catch((err) => {
                    this.isLoading = false;
                    this.formError = true;

                    if (err.error == "ServerError") {
                        this.formError = false;
                        this.serverError = true;
                    }
                    return;
                });
            }
        }
    }

    var app = angular.module('tuho');
    app.controller('TournamentsAddController', TournamentsAddController);
}
;

