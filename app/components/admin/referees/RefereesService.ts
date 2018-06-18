/// <reference path="../../../shared/references.ts"/>
module tuho.admin.services {
    'use strict';

    export interface RefereeServiceInterface {
        makeReferee(userId: number): ng.IHttpPromise<interfaces.Referee[]>;

        addRefereeCourt(refereeId: number, courtId): ng.IHttpPromise<any>;

        removeRefereeCourt(refereeId: number, courtId): ng.IHttpPromise<any>;

        removeReferee(refereeId): ng.IHttpPromise<any>;
    }

    export class RefereesService implements RefereeServiceInterface {
        static $inject = [
            "$http",
            "$log"
        ];

        constructor(private $http: any, private $log: any) {
        }

        public statuses: string[];

        public getReferees() {
            return this.$http.get("/api/admin/referees").success(function (referees) {
                return referees;
            }).error(function (err) {
                console.log(err);
                return err;
            });
        }

        public addRefereeCourt(refereeId, courtId) {
            return this.$http.put("/api/admin/referees/" + refereeId + "/addcourt", {courtId: courtId});
        }

        public removeRefereeCourt(refereeId, courtId) {
            return this.$http.put("/api/admin/referees/" + refereeId + "/removecourt", {courtId: courtId});
        }

        public makeReferee(userId) {
            var body = {
                userId: userId
            };
            return this.$http.post("/api/admin/referees", body);
        }

        public removeReferee(refereeId) {
            return this.$http.delete("/api/admin/referees/" + refereeId);
        }

        public setRefereeStatus(refereeId, status) {
            return this.$http.put("/api/admin/referees/" + refereeId + "/setstatus", {status: status});
        }

        public setPowerbank(refereeId, status) {
            return this.$http.put("/api/admin/referees/" + refereeId + "/setpowerbank", {status: status});
        }

        public setPawn(refereeId, status) {
            return this.$http.put("/api/admin/referees/" + refereeId + "/setpawn", {status: status});
        }
    }

    var module = angular.module('tuho');
    module.service("RefereesService", RefereesService);
}