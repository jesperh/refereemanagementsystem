/// <reference path="../shared/references.ts"/>
module tissi {
    'use strict';

    export class AuthorizationService {
        private authenticated: boolean;
        private identity: interfaces.UserIdentityInterface;

        constructor(private $http: any, private $log: any, private $state: angular.ui.IStateService, private $rootScope, private UserService) {
            this.authenticated = false;
        }

        authorize() {
            return this.UserService.identify().then(() => {

                var isAuthenticated = this.UserService.isAuthenticated();
                if (this.$rootScope.toState.data.roles && this.$rootScope.toState.data.roles.length > 0 && !this.UserService.isInAnyRole(this.$rootScope.toState.data.roles)) {
                    if (isAuthenticated) {
                        this.$state.go('denied');
                    }
                    // user is signed in but not authorized for desired state
                    else {
                        // user is not authenticated. stow the state they wanted before you
                        // send them to the signin state, so you can return them when you're done
                        this.$rootScope.returnToState = this.$rootScope.toState;
                        this.$rootScope.returnToStateParams = this.$rootScope.toStateParams;

                        // now, send them to the signin state so they can log in
                        this.$state.go('denied');
                    }
                }
            });
        }
    }

    var module = angular.module('tissi');
    module.service("AuthorizationService", ["$http", "$log", "$state", "$rootScope", "UserService", AuthorizationService]);
}