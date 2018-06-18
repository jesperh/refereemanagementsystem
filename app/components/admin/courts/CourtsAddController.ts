/// <reference path="../../../shared/references.ts"/>

module tuho {
    'use strict';

    export class CourtsAddController {

        static $inject = [
            "CourtsService",
            "$scope",
            "$state",
            "UserService"
        ];

        public $timeout: ng.ITimeoutService;
        public $state: angular.ui.IStateService;
        public formError: boolean;
        public court: any;
        public scope: any;
        public formSuccess: boolean;
        public serverError: boolean;
        public isLoading: boolean;

        constructor(private CourtsService: any, $scope, $state, private UserService) {
            this.formError = false;
            this.scope = $scope;
            this.$state = $state;
            this.serverError = false;
            this.formSuccess = false;
        }

        submitForm = (valid) => {

            if(!this.court) {
                this.formError = true;
                return;
            }
            this.isLoading = true;

            if(valid == false) {
                this.formError = true;
            } else {
                this.serverError = false;

                this.CourtsService.addCourt(this.court).then((court:any) => {
                    this.isLoading = false;
                    this.formError = false;
                    this.formSuccess = true;
                }).catch((err) => {
                    alert("Palveimella sattui virhe");
                    this.isLoading = false;
                    this.formError = true;

                    if(err.error == "ServerError") {
                        this.formError = false;
                        this.serverError = true;
                    }
                    return;
                });
            }
        }
    }

    var app = angular.module('tuho');
    app.controller('CourtsAddController', CourtsAddController);
};

