/// <reference path="../../../shared/references.ts"/>
module tuho.admin.services
{
    'use strict';

    export interface TournamentsServiceInterface {
        addTournament(tournament): ng.IHttpPromise<any>;
    }

    export class TournamentsService implements TournamentsServiceInterface
    {
        static $inject = [
            "$http",
            "$log"
        ];

        constructor(private $http: any, private $log: any)  {
        }

        public addTournament(tournament) {
            return this.$http.post("/api/admin/tournaments", tournament)
        }

        public getTournaments(){
            return this.$http.get("/api/admin/tournaments").then(function(users){
                return users;
            }).catch(function(err){
                console.log(err);
                return err;
            });
        }
    }

    var module = angular.module('tuho');
    module.service("TournamentsService", TournamentsService);
}