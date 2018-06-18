/// <reference path="../../shared/references.ts"/>
module tissi.services {
    'use strict';

    export interface UserServiceInterface {
        identify(): ng.IPromise<any>;
        getUserForEdit(): ng.IPromise<any>;
        updateUser(user): ng.IHttpPromise<any>;
        isAuthenticated(): boolean;
        getUserId(): number;
    }

    export class UserService {
        static $inject = [
            "$http",
            "$log",
            "$q",
            "$state"
        ];

        private authenticated: boolean;
        private identity: interfaces.UserIdentityInterface;


        constructor(private $http: any, private $log: ng.ILogService, private $q: ng.IQService, private $state) {
            this.authenticated = false;
        }

        isIdentityResolved() {
            return angular.isDefined(this.identity);
        }

        isAuthenticated() {
            return this.authenticated;
        }

        isInRole(role) {
            if (!this.authenticated || !this.identity.role) {
                return false;
            }

            return this.identity.role === role;
        }

        isInAnyRole(roles) {
            if (!this.authenticated || !this.identity.role) {
                return false;
            }

            for (var i = 0; i < roles.length; i++) {
                if (this.isInRole(roles[i])) {
                    return true;
                }
            }

            return false;
        }

        authenticate(identity) {
            if (identity) {
                this.authenticated = true;
                this.identity = identity;
                return true;
            }
            this.authenticated = false;
            this.identity = null;
            return false;

        }

        identify() {
            var deferred = this.$q.defer();

            // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
            if (angular.isDefined(this.identity)) {
                deferred.resolve(this.identity);

                return deferred.promise;
            }
            var _self = this;
            //otherwise, retrieve the identity data from the server, update the identity object, and then resolve.
            this.$http.get('/api/user/identity')
                .success((data: any) => {
                    if (Object.keys(data).length === 0 || !data) {
                        _self.identity = null;
                        _self.authenticated = false;
                        deferred.resolve(_self.identity);
                    } else {
                        _self.identity = data;
                        _self.authenticated = true;
                        deferred.resolve(_self.identity);
                    }

                })
                .error(() => {
                    _self.identity = null;
                    _self.authenticated = false;
                    deferred.resolve(_self.identity);

                })
                .finally(() => {

                    //return deferred.promise;
                });
            return deferred.promise;
        }

        getUserId() {
            return this.identity.id;
        }

        getUserForEdit() {
            if (!this.isAuthenticated()) {
                console.error("Not authenticated!");
                this.$state.go('denied');
                return false;
            }

            if (!this.identity.id) {
                console.error("Id is undefined!");
                this.$state.go('denied');
                return false;
            }

            return this.$http.get("/api/user/" + this.identity.id).success(function (data) {
                return data;
            });
        }

        updateUser(user: any) {

            if (!this.isAuthenticated()) {
                console.error("Not authenticated!");
                return false;
            }

            if (!this.identity.id) {
                console.error("Id is undefeined!");
                return false;
            }
            return this.$http.put("/api/user/" + this.identity.id, user);
        }
    }

    var module = angular.module('tissi');
    module.service("UserService", UserService);
}