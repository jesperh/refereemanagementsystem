/// <reference path="../../shared/references.ts"/>
module tuho {
    'use strict';

    export interface MainControllerInterface extends ng.IScope {
        user: interfaces.User;
    }

    export class MainController {

        static $inject = [
            "AuthorizationService",
            "authorize",
            "MainService",
            "$log",
            "UserService"
        ];

        public user: interfaces.User;
        public isLoading: boolean;

        constructor(AuthorizationService, authorize, private MainService, public $log, private UserService) {
            //this.user = {};
            this.$log = $log;
            this.isLoading = false;
        }

        loggedin() {
            return this.UserService.isAuthenticated();
        }

        interestedThisYear = () => {
            return this.UserService.isUserInterestedThisYear();
        }

        willRefereeThisYear = () => {
            return this.UserService.willRefereeThisYear();
        }
    }

    var app = angular.module('tuho');
    app.controller('MainController', MainController);
}
;
